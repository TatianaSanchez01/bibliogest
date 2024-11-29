import prisma from 'config/prisma';

const OrderItemCustomResolvers = {
  User: {},
  Query: {},
  Mutation: {
    createOrderItemCustom: async (_: any, args: any) => {
      return await prisma.orderItem.create({
        data: {...args.data, quantity: 1} ,
      });
    },
  },
};

export { OrderItemCustomResolvers };
