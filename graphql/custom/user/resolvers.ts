import prisma from 'config/prisma';

const UserCustomResolvers = {
  User: {},
  Query: {},
  Mutation: {
    createUserCustom: async (_: any, args: any) => {
      return await prisma.user.create({
        data: args.data,
      });
    },
  },
};

export { UserCustomResolvers };