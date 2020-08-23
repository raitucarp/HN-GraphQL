import { Item } from "../data-sources/hackernews";

export const commentsResolver = async (
  item: Item,
  { offset, limit }: any,
  { dataSources }: any
) => {
  if (!item.kids) return [];
  return dataSources.hackerNewsAPI.getItemByIds(item.kids, offset, limit);
};

export const itemResolver = async (
  root: any,
  { itemId }: any,
  { dataSources }: any
) => dataSources.hackerNewsAPI.getItem(itemId);

export const urlMetaResolver = async (
  item: Item,
  args: any,
  { dataSources }: any
) => {
  if (!item.url) return {};
  return dataSources.urlMetaAPI.getMetaFromURL(item.url);
};
