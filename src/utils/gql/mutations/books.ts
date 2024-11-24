import { gql } from 'apollo-server-micro';

export const UPSERT_BOOK = gql`
  mutation UpsertBook($where: BookWhereUniqueInput!, $data: BookInput) {
    upsertBook(where: $where, data: $data) {
      id
      title
      author
      isbn
      publicationDate
      genre
      copies
      image
    }
  }
`;
