import { User, Item } from "../data-sources/hackernews";

export const userInfoResolver = async (
  item: Item,
  _args: any,
  { dataSources }: any
) => {
  const username = item.by;
  if (!username) return {};
  const user = await dataSources.hackerNewsAPI.getUser(username);
  return {
    ...user,
    avatarUrl: `${process.env.AVATAR_BASE_URL}${username}.png`,
  };
};

export const userStoriesResolver = async (
  user: User,
  { offset, limit }: any,
  { dataSources }: any
) => {
  if (!user.submitted) return [];
  return dataSources.hackerNewsAPI.getItemByIds(user.submitted, offset, limit);
};

export const userResolver = async (
  _root: any,
  { username }: any,
  { dataSources }: any
): Promise<User> => {
  const userData = dataSources.hackerNewsAPI.getUser(username);
  return {
    ...userData,
    avatarUrl: `${process.env.AVATAR_BASE_URL}${username}.png`,
  };
};
