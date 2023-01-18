const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/subgraph");

const typeDefs = gql`

  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key",  "@shareable"])

  type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String! @shareable
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];
