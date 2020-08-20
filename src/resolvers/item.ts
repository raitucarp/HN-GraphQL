export const byUserResolver = async (
  item: any,
  _args: any,
  { dataSources }: any
) => {
  const username = item.by;
  const user = dataSources.hackerNewsAPI.getUser(username);
  return user;
};

export const commentsResolver = async (
  item: any,
  { offset, limit }: any,
  { dataSources }: any
) => {
  if (!item.kids) return [];

  const comments = item.kids
    .slice(offset, limit)
    .map((id: number) => dataSources.hackerNewsAPI.getItem(id));
  return comments;
};
