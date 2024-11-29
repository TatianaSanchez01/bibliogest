import { gql } from 'apollo-server-micro';

const CustomOrdersTypes = gql`
  type Mutation {
    upsertOrder(data: OrderInput, where: OrderWhereUniqueInput!): Order
  }
  input OrderInput {
    create: OrderCreateInputCustom
    update: OrderUpdateInputCustom
  }
  
  input OrderCreateInputCustom {
    customerId: String
    status: String
  }

  input OrderUpdateInputCustom {
    status: String
  }
`;

export { CustomOrdersTypes };