import { gql, ApolloServer, UserInputError } from "apollo-server";
import { v1 as uuid } from "uuid";

const persons = [
  {
    name: "Victor",
    phone: "034-1234567",
    street: "Calle 1",
    city: "Barcelona",
    id: "db1799b4-6cfe-488c-888b-a94f3d20bec3",
  },
  {
    name: "Jose",
    phone: "044-1234577",
    street: "Calle 2",
    city: "Mataro",
    id: "6749c0a4-1776-435c-a6e8-6542da9a964d",
  },
  {
    name: "Edwin",
    street: "Calle 3",
    city: "Ibiza",
    id: "531cd97c-b080-469c-8b4a-a1a32af292d2",
  },
];

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => {
      const { name } = args;
      return persons.find((p) => p.name === root.name);
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find( x=> x.name === args.name)) {
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name,
        });
      }

      const person = { ...args, id: uuid() };
      persons.push(person);
      return person;
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready. at ${url}`);
});
