import { gql } from 'apollo-server-micro';

const GET_ORDERS = gql`
  query Orders {
    orders {
      id
      customer {
        name
        email
      }
      status
      createdAt
      items {
        bookId
      }
    }
  }
`;

const GET_ORDER_BY_ID = gql `
    query Order($orderId: String!) {
  order(id: $orderId) {
    id
    status
    createdAt
    customer {
      document
      id
      name
      email
    }
    items {
      id
      quantity
      book {
        id
        title
        author
        isbn
        publicationDate
        genre
        image
      }
      
    }
  }
}
`;

export {GET_ORDERS, GET_ORDER_BY_ID}