export const submittedItemsResolver = async (
  user: any,
  { offset, limit }: any,
  { dataSources }: any
) => {
  if (user.submitted <= 0) return [];
  const submittedItems = user.submitted
    .slice(offset, limit)
    .map((id: number) => dataSources.hackerNewsAPI.getItem(id));
  return submittedItems;
};
