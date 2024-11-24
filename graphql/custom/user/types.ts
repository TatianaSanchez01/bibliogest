import { gql } from 'apollo-server-micro';

const CustomUserTypes = gql`
  type Mutation {
    createUserCustom(data: UserCustomInput): User
  }
  input UserCustomInput {
    name: String
    email: String
    emailVerified: DateTime
    image: String
    role: Enum_RoleName
    accounts: AccountsCustomInput
  }
  input AccountsCustomInput {
    create: AccountInputCustom
  }
  input AccountInputCustom {
    type: String!
    provider: String!
    providerAccountId: String!
    refresh_token: String
    access_token: String
    expires_at: Int
    token_type: String
    scope: String
    id_token: String
    session_state: String
  }
`;

export { CustomUserTypes };