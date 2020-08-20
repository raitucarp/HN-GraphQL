import { ApolloServer, gql } from "apollo-server";
import { HackerNewsAPI } from "./data-sources/hackernews";
import { RedisCache } from "apollo-server-cache-redis";
import resolvers from "./resolvers";
import typeDefs from "./typedefs";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: new RedisCache({
    host: "localhost",
  }),
  cacheControl: true,
  dataSources: () => {
    return {
      hackerNewsAPI: new HackerNewsAPI(),
    };
  },
});

export default server;
