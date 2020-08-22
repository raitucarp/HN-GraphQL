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
    replies(offset: Int = 0, limit: Int = 5): [UserStory]
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

  union UserStory = Story | Job | Poll | Comment | PollOption

  type User {
    id: String!
    delay: Int
    created: Int!
    karma: Int
    about: String
    submitted: [Int]
    avatarUrl: String
    stories(offset: Int = 0, limit: Int = 5): [UserStory]
  }

  type Query {
    top_stories(offset: Int! = 0, limit: Int! = 5): [UserStory!]!
    new_stories(offset: Int! = 0, limit: Int! = 5): [UserStory!]!
    best_stories(offset: Int! = 0, limit: Int! = 5): [UserStory!]!
    ask_stories(offset: Int! = 0, limit: Int! = 5): [UserStory!]!
    show_stories(offset: Int! = 0, limit: Int! = 5): [UserStory!]!
    job_stories(offset: Int! = 0, limit: Int! = 5): [Job!]!
  type Subscription {
    itemsUpdated: [UserStory]
    profilesUpdated: [User]
  }
`;

export default typeDefs;
