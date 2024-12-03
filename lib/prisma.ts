import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of PrismaClient in development mode
const prismaGlobal = globalThis as typeof globalThis & { prisma?: PrismaClient };

const prisma = prismaGlobal.prisma || new PrismaClient();

// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.POSTGRES_PRISMA_URL,
//     },
//   },
// });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

export { prisma };