import prisma from 'config/prisma';

const CustomersCustomResolvers = {
  User: {},
  Query: {},
  Mutation: {
    upsertCustomer: async (_: any, args: any) => {
      return await prisma.customer.upsert({
        create: args.data.create,
        update: args.data.update,
        where: args.where,
      });
    },
  },
};

export { CustomersCustomResolvers };