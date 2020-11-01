import "apollo-cache-control";
import { commentRepliesResolver, commentReplyOfResolver } from "./comment";
import { commentsResolver, itemResolver, urlMetaResolver } from "./item";
import { Item } from "../data-sources/hackernews";
import { PubSub } from "apollo-server";
import { storyResolver } from "./stories";
import { updatesResolver } from "./updates";
import { userStoriesResolver, userResolver, userInfoResolver } from "./user";

export const ITEMS_UPDATED = "ITEMS_UPDATED";
export const PROFILES_UPDATED = "PROFILES_UPDATED";

export const pubsub = new PubSub();
const resolvers = {
  Item: {
    __resolveType() {
      return null;
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
    user_info: userInfoResolver,
    replies: commentRepliesResolver,
    reply_of: commentReplyOfResolver,
  },
  User: {
    stories: userStoriesResolver,
  },
  Story: {
    url_meta: urlMetaResolver,
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
    updates: updatesResolver,
    user: userResolver,
    item: itemResolver,
  },

  Subscription: {
    items: {
      subscribe: () => pubsub.asyncIterator([ITEMS_UPDATED]),
    },
    profiles: {
      subscribe: () => pubsub.asyncIterator([PROFILES_UPDATED]),
    },
  },
};

export default resolvers;
