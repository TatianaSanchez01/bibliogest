import { gql } from 'apollo-server-micro';

const GET_BOOKS_INFO = gql`
  query Books {
    books {
      id
      title
      author
      isbn
      genre
      copies
      image
    }
  }
`;
const GET_BOOKS = gql`
  query getBooks {
    books {
      id
      image
      title
      author
      isbn
      publicationDate
      genre
      copies
    }
  }
`;

const GET_BOOK_BY_ID = gql`
  query getBookById($bookId: String!) {
    book(id: $bookId) {
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

export { GET_BOOKS, GET_BOOK_BY_ID, GET_BOOKS_INFO };
