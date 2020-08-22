import { Item } from "../data-sources/hackernews";

export const userInfoResolver = async (
  item: Item,
  _args: any,
  { dataSources }: any
) => {
  const username = item.by;
  const user = dataSources.hackerNewsAPI.getUser(username);
  return user;
};

export const commentsResolver = async (
  item: Item,
  { offset, limit }: any,
  { dataSources }: any
) => {
  if (!item.kids) return [];
  return dataSources.hackerNewsAPI.getItemByIds(item.kids, offset, limit);
};
