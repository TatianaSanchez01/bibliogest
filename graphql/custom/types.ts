import { CustomBooksTypes } from './books/types';
import { CustomCalculadoraTypes } from './calculadora/types';
import { CustomCustomersTypes } from './customers/types';
import { CustomOrderItemTypes } from './orderitem.ts/types';
import { CustomOrdersTypes } from './orders/types';
import { CustomPruebaTypes } from './prueba/types';
import { CustomUserTypes } from './user/types';

const customTypes = [
  CustomCalculadoraTypes,
  CustomPruebaTypes,
  CustomUserTypes,
  CustomBooksTypes,
  CustomCustomersTypes,
  CustomOrdersTypes,
  CustomOrderItemTypes
];
export { customTypes };
