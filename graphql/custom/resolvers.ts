import { BooksCustomResolvers } from './books/resolvers';
import { CalculadoraResolvers } from './calculadora/resolvers';
import { PruebaResolvers } from './prueba/resolvers';
import { UserCustomResolvers } from './user/resolvers';

const customResolvers = [
  CalculadoraResolvers,
  PruebaResolvers,
  UserCustomResolvers,
  BooksCustomResolvers,
];

export { customResolvers };
