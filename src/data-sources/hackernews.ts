import {
  RESTDataSource,
  RequestOptions,
  HTTPCache,
} from "apollo-datasource-rest";
import { cond, match, equals, always, SafePred } from "ramda";

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

const REQUEST_CACHE_TTL = 5 * 60;
if (!process.env.HACKERNEWS_API_BASE_URL) {
  throw new Error("No HN API defined");
}

export class HackerNewsAPI extends RESTDataSource {
  baseURL = process.env.HACKERNEWS_API_BASE_URL;
  httpCache = new HTTPCache();

  constructor() {
    super();
  }

  willSendRequest(request: RequestOptions) {
    request.cacheOptions = {
      ttl: REQUEST_CACHE_TTL,
    };
  }

  async getItem(id: number): Promise<Item> {
    return this.get<Item>(`item/${id}.json`);
  }

  async getUser(username: string): Promise<User> {
    return this.get<User>(`user/${username}.json`);
  }

  async getUsers(
    usernameList: string[],
    offset: number = 0,
    limit: number = 10
  ): Promise<User[]> {
    const users = usernameList
      .slice(offset, limit)
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
    const stories = ids.slice(offset, limit).map((id) => this.getItem(id));
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
    return this.getItemByIds(storyIds, offset, limit);
  }
}