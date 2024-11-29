import { gql } from 'apollo-server-micro';

const CustomOrderItemTypes = gql`
  type Mutation {
    createOrderItemCustom(data: OrderItemInputCustom): OrderItem
  }
    
  input OrderItemInputCustom {
    orderId: String
    bookId: String
    quantity: Int
  }
`;

export { CustomOrderItemTypes };