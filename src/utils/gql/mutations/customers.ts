import { gql } from 'apollo-server-micro';

export const UPSERT_CUSTOMER = gql`
  mutation UpsertCustomer(
    $where: CustomerWhereUniqueInput!
    $data: CustomerInput
  ) {
    upsertCustomer(where: $where, data: $data) {
      id
      document
      name
      email
      phone
      address
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($where: CustomerWhereUniqueInput!) {
    deleteCustomer(where: $where) {
      id
      document
      name
    }
  }
`;
