import {
  RESTDataSource,
  RequestOptions,
  HTTPCache,
} from "apollo-datasource-rest";
import { cond, equals, always } from "ramda";
import { REQUEST_CACHE_TTL } from "../config/from-env";
import https from "https";
import turndown from "turndown";
// @ts-ignore
import decode from "unescape";

export type ItemType = "job" | "story" | "comment" | "poll" | "pollopt";
export type StoriesType = "top" | "new" | "best" | "ask" | "show" | "job";

export type Item = {
  id: number;
  deleted?: boolean;
  type: ItemType;
  by: string;
  time: number;
  text: string;
  dead?: boolean;
  parent: number;
  poll?: number;
  kids: number[];
  url: string;
  score: number;
  title: string;
  parts: number[];
  descendants: number;
};

export type User = {
  id: string;
  delay: number;
  created: number;
  karma: number;
  about: string;
  submitted: number[];
  avatarUrl?: string;
};

if (!process.env.HACKERNEWS_API_BASE_URL) {
  throw new Error("No HN API defined");
}

export class HackerNewsAPI extends RESTDataSource {
  baseURL = process.env.HACKERNEWS_API_BASE_URL;
  httpCache = new HTTPCache();
  turndownService = new turndown();

  willSendRequest(request: RequestOptions) {
    request.cacheOptions = {
      ttl: REQUEST_CACHE_TTL,
    };
  }

  async getItem(id: number): Promise<Item> {
    const item = await this.get<Item>(`item/${id}.json`);
    if (!item) return item;
    const text = item.text
      ? this.turndownService.turndown(decode(item.text))
      : "";
    return { ...item, text };
  }

  async getUser(username: string): Promise<User> {
    const user = await this.get<User>(`user/${username}.json`);
    console.log({ user });
    if (!user) return user;

    const about = user.about
      ? this.turndownService.turndown(decode(user.about))
      : "";

    console.log("wwerewrwe", { ...user, about });
    return { ...user, about };
  }

  async getUsers(
    usernameList: string[],
    offset: number = 0,
    limit: number = 10
  ): Promise<User[]> {
    const users = usernameList
      .slice(offset, offset + limit)
      .map((username) => this.getUser(username));
    return Promise.all(users);
  }

  async maxItem(): Promise<number> {
    return this.get<number>(`maxitem.json`);
  }

  async getTopStories(): Promise<number[]> {
    return this.get<number[]>(`topstories.json`);
  }

  async getUpdates(): Promise<{ items: number[]; profiles: [] }> {
    return this.get("updates.json");
  }

  async getNewStories(): Promise<number[]> {
    return this.get<number[]>(`newstories.json`);
  }

  async getBestStories(): Promise<number[]> {
    return this.get<number[]>(`beststories.json`);
  }

  async getAskStories(): Promise<number[]> {
    return this.get<number[]>(`askstories.json`);
  }

  async getShowStories(): Promise<number[]> {
    return this.get<number[]>(`showstories.json`);
  }

  async getJobStories(): Promise<number[]> {
    return this.get<number[]>(`jobstories.json`);
  }

  async getItemByIds(
    ids: number[],
    offset: number,
    limit: number
  ): Promise<Item[]> {
    const stories = ids
      .slice(offset, offset + limit)
      .map((id) => this.getItem(id));
    return Promise.all(stories);
  }

  async getStories(
    type: StoriesType,
    offset: number,
    limit: number
  ): Promise<Item[]> {
    const storyFetcher = cond<StoriesType, () => Promise<number[]>>([
      [equals<StoriesType>("top"), always(this.getTopStories)],
      [equals<StoriesType>("best"), always(this.getBestStories)],
      [equals<StoriesType>("new"), always(this.getNewStories)],
      [equals<StoriesType>("ask"), always(this.getAskStories)],
      [equals<StoriesType>("show"), always(this.getShowStories)],
      [equals<StoriesType>("job"), always(this.getJobStories)],
    ])(type).bind(this);

    const storyIds = await storyFetcher();
    const items = await this.getItemByIds(storyIds, offset, limit);
    return items.filter((item) => item !== null);
  }

  static subscribeUpdates(
    onUpdate: (
      data: { items: Item[]; profiles: User[] } | null,
      error?: Error
    ) => void
  ) {
    const updatesURL = `${process.env.HACKERNEWS_API_BASE_URL}updates.json`;
    const headers = {
      Accept: "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };

    const reqOptions = {
      headers,
    };

    const HNAPI = new HackerNewsAPI();

    const req = https.request(updatesURL, reqOptions, (res) => {
      res.setEncoding("utf8");
      res.on("data", async (chunk) => {
        try {
          const chunkString = chunk.toString();
          const splittedChunk = chunkString.split("\n");
          const data = splittedChunk[1];
          const splittedData = data.split("data: ");
          const JsonString = splittedData[1];
          const eventData = JSON.parse(JsonString);
          if (eventData === null) return onUpdate(null, new Error("No data"));
          const { items: _items, profiles: _profiles } = eventData.data as {
            items: number[];
            profiles: string[];
          };

          const [items, users] = await Promise.all([
            HNAPI.getItemByIds(_items, 0, 50),
            HNAPI.getUsers(_profiles),
          ]);
          onUpdate({ items, profiles: users });
        } catch (err) {
          throw new Error(err);
        }
      });

      res.on("end", () => {
        console.log("No more data in response.");
      });
    });

    req.on("error", (e) => {
      console.error(`Got error: ${e.message}`);
    });

    req.end();
  }
}
