import { ApolloServer } from "apollo-server-express";
import { HackerNewsAPI } from "./data-sources/hackernews";
import resolvers from "./resolvers";
import typeDefs from "./typedefs";
import * as http from "http";
import * as express from "express";
import { URLMetaAPI } from "./data-sources/urlmeta";

const app = express();

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      hackerNewsAPI: new HackerNewsAPI(),
      urlMetaAPI: new URLMetaAPI(),
    };
  },
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
