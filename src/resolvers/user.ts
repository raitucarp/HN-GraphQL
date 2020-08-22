import { User } from "../data-sources/hackernews";

export const userStoriesResolver = async (
  user: User,
  { offset, limit }: any,
  { dataSources }: any
) => {
  if (!user.submitted) return [];
  return dataSources.hackerNewsAPI.getItemByIds(user.submitted, offset, limit);
};

export const userResolver = async (
  root: any,
  { username }: any,
  { dataSources }: any
): Promise<User> => {
  const userData = dataSources.hackerNewsAPI.getUser(username);
  return {
    ...userData,
    avatarUrl: `${process.env.AVATAR_BASE_URL}${username}`,
  };
};
