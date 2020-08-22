import { Item, StoriesType } from "data-sources/hackernews";

type PaginationArgs = { offset: number; limit: number };

export const storyResolver = (type: StoriesType) => async (
  _source: any,
  { offset, limit }: PaginationArgs,
  { dataSources }: any
): Promise<Item[]> => dataSources.hackerNewsAPI.getStories(type, offset, limit);
