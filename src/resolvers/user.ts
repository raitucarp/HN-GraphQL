import { User } from "../data-sources/hackernews";

export const userStoriesResolver = async (
  user: User,
  { offset, limit }: any,
  { dataSources }: any
) => {
  if (!user.submitted) return [];
  return dataSources.hackerNewsAPI.getItemByIds(user.submitted, offset, limit);
};
