import { makeExecutableSchema } from "apollo-server";
import resolvers from "./resolvers";
import typeDefs from "./typedefs";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
