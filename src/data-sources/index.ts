import { HackerNewsAPI } from "./hackernews";
import { URLMetaAPI } from "./urlmeta";

export const dataSources = () => ({
  hackerNewsAPI: new HackerNewsAPI(),
  urlMetaAPI: new URLMetaAPI(),
});
