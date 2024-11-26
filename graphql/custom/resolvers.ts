import { BooksCustomResolvers } from './books/resolvers';
import { CalculadoraResolvers } from './calculadora/resolvers';
import { CustomersCustomResolvers } from './customers/resolvers';
import { PruebaResolvers } from './prueba/resolvers';
import { UserCustomResolvers } from './user/resolvers';

const customResolvers = [
  CalculadoraResolvers,
  PruebaResolvers,
  UserCustomResolvers,
  BooksCustomResolvers,
  CustomersCustomResolvers
];

export { customResolvers };
