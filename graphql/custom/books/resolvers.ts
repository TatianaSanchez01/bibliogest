import prisma from 'config/prisma';

const BooksCustomResolvers = {
  User: {},
  Query: {},
  Mutation: {
    upsertBook: async (_: any, args: any) => {
      return await prisma.book.upsert({
        create: args.data.create,
        update: args.data.update,
        where: args.where,
      });
    },
  },
};

export { BooksCustomResolvers };
