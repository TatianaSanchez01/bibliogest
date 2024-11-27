import { gql } from 'apollo-server-micro';

export const CREATE_USER = gql`
  mutation CreateUserCustom($data: UserCustomInput) {
    createUserCustom(data: $data) {
      id
      name
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput) {
    updateUser(where: $where, data: $data) {
      id
      name
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($where: UserWhereUniqueInput!) {
    deleteUser(where: $where) {
      name
    }
  }
`;
