import { gql } from 'apollo-server-micro';

export const UPSERT_ORDER = gql`
  mutation UpsertOrder($where: OrderWhereUniqueInput!, $data: OrderInput) {
    upsertOrder(where: $where, data: $data) {
      id
      customerId
      status
    }
  }
`;
