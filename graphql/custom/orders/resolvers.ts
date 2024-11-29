import prisma from 'config/prisma';

const OrdersCustomResolvers = {
  User: {},
  Query: {},
  Mutation: {
    upsertOrder: async (_: any, args: any) => {
      return await prisma.order.upsert({
        create: args.data.create,
        update: args.data.update,
        where: args.where,
      });
    },
  },
};

export { OrdersCustomResolvers };