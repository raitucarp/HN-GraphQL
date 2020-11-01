import { ApolloServer } from "apollo-server-express";
import { RedisCache } from "apollo-server-cache-redis";
import { REQUEST_CACHE_TTL, REDIS_CONNECTION_STRING } from "./config/from-env";
import express from "express";
import http from "http";
import responseCachePlugin from "apollo-server-plugin-response-cache";
import schema from "./schema";
import { dataSources } from "./data-sources";
import { HackerNewsAPI } from "./data-sources/hackernews";
import { ITEMS_UPDATED, PROFILES_UPDATED, pubsub } from "./resolvers";

const app = express();
const redisCache = new RedisCache(REDIS_CONNECTION_STRING);

export const server = new ApolloServer({
  schema,
  tracing: true,
  cache: redisCache,
  cacheControl: {
    defaultMaxAge: REQUEST_CACHE_TTL,
  },
  dataSources: dataSources,
  context: ({ req, connection }) => {
    if (connection) {
      return {
        dataSources: dataSources(),
      };
    }
    return {};
  },
  plugins: [responseCachePlugin({ cache: redisCache })],
});

server.applyMiddleware({ app });
app.get("/", (_req, res) =>
  res.send({
    message: "Welcome to HN GraphQL Server",
    server: {
      graphql: server.graphqlPath,
      subscription: server.subscriptionsPath,
    },
    author: {
      name: "Ribhararnus Pracutiar",
      github: "https://github.com/raitucarp",
      twitter: "@raitucarp",
    },
  })
);

app.use((_req, res, _next) => {
  res
    .status(404)
    .send({ message: "endpoint not found :(", suggestion: "go back to /" });
});

export const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
