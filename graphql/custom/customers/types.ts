import { gql } from 'apollo-server-micro';

const CustomCustomersTypes = gql`
  type Mutation {
    upsertCustomer(data: CustomerInput, where: CustomerWhereUniqueInput!): Customer
  }
  input CustomerInput {
    create: CustomerCreateInput
    update: CustomerUpdateInputCustom
  }

  input CustomerUpdateInputCustom {
    document: String
    name: String
    email: String
    phone: String
    address: String
  }
`;

export { CustomCustomersTypes };
