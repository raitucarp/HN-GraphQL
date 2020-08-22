import { gql } from "apollo-server";

const typeDefs = gql`
  enum ItemType {
    job
    story
    comment
    poll
    pollopt
  }

  interface Item {
    id: Int!
    deleted: Boolean
    type: ItemType!
    by: String
    time: Int
    dead: Boolean
    kids: [Int]
  }

  type Job implements Item {
    id: Int!
    deleted: Boolean
    type: ItemType!
    by: String
    time: Int
    dead: Boolean
    kids: [Int]
    text: String
    url: String
    title: String
  }

  type Story implements Item {
    id: Int!
    deleted: Boolean
    type: ItemType!
    by: String
    time: Int
    dead: Boolean
    kids: [Int]
    descendants: Int
    score: Int
    title: String
    url: String
    text: String
    user_info: User!
    comments(offset: Int = 0, limit: Int = 5): [Comment]
  }

  type Comment implements Item {
    id: Int!
    deleted: Boolean
    type: ItemType!
    by: String
    time: Int
    dead: Boolean
    kids: [Int]
    parent: Int
    text: String
    reply_of: UserStory
    replies(offset: Int!, limit: Int!): [UserStory]
  }

  type Poll implements Item {
    id: Int!
    deleted: Boolean
    type: ItemType!
    by: String
    time: Int
    dead: Boolean
    kids: [Int]
    parts: [Int]
    descendants: Int
    score: Int
    title: String
    text: String
  }

  type PollOption implements Item {
    id: Int!
    deleted: Boolean
    type: ItemType!
    by: String
    time: Int
    dead: Boolean
    kids: [Int]
    parent: Int
    score: Int
  }

  union Stories = Story | Job | Poll
  union UserStory = Story | Job | Poll | Comment | PollOption

  type User {
    id: String!
    delay: Int
    created: Int!
    karma: Int!
    about: String
    submitted: [Int]
    avatarUrl: String
    stories(offset: Int!, limit: Int!): [UserStory]
  }

  type Query {
    top_stories(offset: Int!, limit: Int!): [Stories!]!
    new_stories(offset: Int!, limit: Int!): [Stories!]!
    best_stories(offset: Int!, limit: Int!): [Stories!]!
    ask_stories(offset: Int!, limit: Int!): [Story!]!
    show_stories(offset: Int!, limit: Int!): [Story!]!
    job_stories(offset: Int!, limit: Int!): [Job!]!
  }
`;

export default typeDefs;
