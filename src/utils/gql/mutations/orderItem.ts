import { gql } from 'apollo-server-micro';

export const CREATE_ORDER_ITEM = gql`
  mutation CreateOrderItem($data: OrderItemCreateInput) {
    createOrderItem(data: $data) {
      orderId
      bookId
      quantity
    }
  }
`;
