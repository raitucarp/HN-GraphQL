import { PubSub } from "apollo-server";
import { storyResolver } from "./stories";
import { commentsResolver, itemResolver, urlMetaResolver } from "./item";
import { userStoriesResolver, userResolver, userInfoResolver } from "./user";
import { Item, HackerNewsAPI } from "../data-sources/hackernews";
import { commentRepliesResolver, commentReplyOfResolver } from "./comment";

const ITEMS_UPDATED = "ITEMS_UPDATED";
const PROFILES_UPDATED = "PROFILES_UPDATED";

const pubsub = new PubSub();
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
    user: userResolver,
    item: itemResolver,
  },

  Subscription: {
    itemsUpdated: {
      subscribe: () => pubsub.asyncIterator([ITEMS_UPDATED]),
    },
    profilesUpdated: {
      subscribe: () => pubsub.asyncIterator([PROFILES_UPDATED]),
    },
  },
};

const STORY_UPDATES_INTERVAL: number = parseInt(
  process.env.STORY_UPDATES_INTERVAL ?? (15 * 1000).toString()
);

setInterval(async () => {
  try {
    const hackernewsAPI = new HackerNewsAPI();
    const { items, profiles } = await hackernewsAPI.getUpdates();
    const [updatedStories, updatedProfiles] = await Promise.all([
      hackernewsAPI.getItemByIds(items, 0, 15),
      hackernewsAPI.getUsers(profiles, 0, 10),
    ]);

    pubsub.publish(ITEMS_UPDATED, { itemsUpdated: updatedStories });
    pubsub.publish(PROFILES_UPDATED, { profilesUpdated: updatedProfiles });
  } catch (error) {
    console.error(error);
  }
}, STORY_UPDATES_INTERVAL);

export default resolvers;
