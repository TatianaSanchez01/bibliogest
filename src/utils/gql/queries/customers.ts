import { gql } from 'apollo-server-micro';

const GET_CUSTOMERS_INFO = gql`
  query Customers {
    customers {
      id
      document
      name
    }
  }
`;

const GET_CUSTOMERS = gql`
  query Customers {
    customers {
      id
      document
      name
      email
      phone
      address
      createdAt
      updatedAt
      orders {
        status
        items {
          bookId
        }
      }
    }
  }
`;

const GET_CUSTOMER_BY_ID = gql`
  query Customer($customerId: String!) {
    customer(id: $customerId) {
      document
      name
      email
      phone
      address
    }
  }
`;

export { GET_CUSTOMERS, GET_CUSTOMER_BY_ID, GET_CUSTOMERS_INFO };
