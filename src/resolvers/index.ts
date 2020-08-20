import { storyResolver } from "./stories";
import { byUserResolver, commentsResolver } from "./item";
import { submittedItemsResolver } from "./user";

const resolvers = {
  User: {
    submitted_items: submittedItemsResolver,
  },
  Item: {
    byUser: byUserResolver,
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
