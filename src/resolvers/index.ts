import { storyResolver } from "./stories";
import { userInfoResolver, commentsResolver } from "./item";
import { userStoriesResolver } from "./user";
import { Item } from "data-sources/hackernews";
import { commentRepliesResolver, commentReplyOfResolver } from './comment';

const resolvers = {
  Item: {
    __resolveType() {
      return null;
    },
  },
  Stories: {
    __resolveType(item: Item) {
      if (item.url) return "Story";
      if (item.descendants) return "Poll";
      if (item.text) return "Comment";

      return "Job";
    },
  },
  UserStory: {
    __resolveType(item: Item) {
      if (item.url) return "Story";
      if (item.parts) return "Poll";
      if (item.text) return "Comment";
      if (item.parent && item.score) return "PollOption";
      return "Job";
    },
  },
  Comment: {
    replies: commentRepliesResolver,
    reply_of: commentReplyOfResolver,
  },
  User: {
    stories: userStoriesResolver,
  },
  Story: {
    user_info: userInfoResolver,
    comments: commentsResolver,
  },

  Query: {
    top_stories: storyResolver("top"),
    new_stories: storyResolver("new"),
    best_stories: storyResolver("best"),
    ask_stories: storyResolver("ask"),
    show_stories: storyResolver("show"),
    job_stories: storyResolver("job"),
  },
};

export default resolvers;
