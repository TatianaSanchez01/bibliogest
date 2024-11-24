import { gql } from 'apollo-server-micro';

const CustomBooksTypes = gql`
  type Mutation {
    upsertBook(data: BookInput, where: BookWhereUniqueInput!): Book
  }
  input BookInput {
    create: BookCreateInput
    update: BookUpdateInputCustom
  }

  input BookUpdateInputCustom {
    title: String
    author: String
    isbn: String
    publicationDate: DateTime
    genre: String
    copies: Int
    image: String
  }
`;

export { CustomBooksTypes };
