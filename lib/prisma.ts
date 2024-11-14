import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of PrismaClient in development mode
const prismaGlobal = globalThis as typeof globalThis & { prisma?: PrismaClient };

const prisma = prismaGlobal.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

export { prisma };