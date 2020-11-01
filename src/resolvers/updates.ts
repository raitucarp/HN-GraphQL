import { HackerNewsAPI } from "data-sources/hackernews";

export const updatesResolver = async (
  _source: any,
  { offset = 0, limit = 5 }: any,
  { dataSources }: any
) => {
  const { items, profiles } = await dataSources.hackerNewsAPI.getUpdates();
  const [updatedStories, updatedProfiles] = await Promise.all([
    dataSources.hackerNewsAPI.getItemByIds(items, offset, limit),
    dataSources.hackerNewsAPI.getUsers(profiles, offset, limit),
  ]);

  return {
    items: updatedStories,
    profiles: updatedProfiles,
  };
};
