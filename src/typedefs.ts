import { gql } from "apollo-server";

const typeDefs = gql`
  enum ItemType {
    job
    story
    comment
    poll
    pollopt
  }

  type Item {
    id: Int!
    deleted: Boolean
    type: ItemType!
    by: String!
    time: Int!
    text: String
    dead: Boolean
    parent: Int
    poll: Int
    kids: [Int]
    url: String
    score: Int!
    title: String!
    parts: [Int]
    descendants: Int
    byUser: User!
    comments(offset: Int!, limit: Int!): [Item]
  }

  type User {
    id: String!
    delay: Int
    created: Int!
    karma: Int!
    about: String
    submitted: [Int]
    avatarUrl: String
    submitted_items(offset: Int!, limit: Int!): [Item]
  }

  type Query {
    top_stories(offset: Int!, limit: Int!): [Item!]!
    new_stories(offset: Int!, limit: Int!): [Item!]!
    best_stories(offset: Int!, limit: Int!): [Item!]!
    ask_stories(offset: Int!, limit: Int!): [Item!]!
    show_stories(offset: Int!, limit: Int!): [Item!]!
    job_stories(offset: Int!, limit: Int!): [Item!]!
  }
`;

export default typeDefs;
