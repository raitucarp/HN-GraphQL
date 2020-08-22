import { Item } from "data-sources/hackernews";

export const commentRepliesResolver = async (
  comment: Item,
  { offset = 0, limit = 5 }: any,
  { dataSources }: any
) => {
  if (comment.kids) return [];
  return dataSources.hackerNewsAPI.getItemByIds(comment.kids, offset, limit);
};

export const commentReplyOfResolver = async (
  comment: Item,
  args: any,
  { dataSources }: any
) => dataSources.hackerNewsAPI.getItem(comment.parent);
