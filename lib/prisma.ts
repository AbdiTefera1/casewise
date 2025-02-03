// import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcryptjs'

// // Prevent multiple instances of PrismaClient in development mode
// const prismaGlobal = globalThis as typeof globalThis & { prisma?: PrismaClient };

// const prisma = prismaGlobal.prisma || new PrismaClient();

// // const prisma = new PrismaClient({
// //   datasources: {
// //     db: {
// //       url: process.env.POSTGRES_PRISMA_URL,
// //     },
// //   },
// // });

// // {
// //   "email": "firo@gmail.com",
// //   "password": "firo123",
// //   "name": "Firo Tefera"
// // }
// async function main() {
//   // Check if SUPERADMIN already exists
//   const superAdmin = await prisma.user.findUnique({
//     where: { email: 'superadmin@example.com' }, // Change email accordingly
//   });


//   if (!superAdmin) {
//     // Create SUPERADMIN user
    
//     await prisma.user.create({
//       data: {
//         name: 'Super Admin',
//         email: 'superadmin@example.com',
//         password: await bcrypt.hash('superadmin', 10),
//         role: 'SUPERADMIN',
//       },
//     });

//     console.log('SUPERADMIN user created.');
//   } else {
//     // await prisma.user.delete({ where: { email: 'superadmin@example.com' }})
//     console.log('SUPERADMIN already exists.');
//   }
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
  

// if (process.env.NODE_ENV !== 'production') {
//   prismaGlobal.prisma = prisma;
// }

// export { prisma };



import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Prevent multiple instances of PrismaClient in development mode
const prismaGlobal = globalThis as typeof globalThis & { prisma?: PrismaClient };

const prisma = prismaGlobal.prisma || new PrismaClient({
  // Add error logging to debug issues
  // log: ['query', 'error', 'warn'],
});

async function main() {
  try {
    // Check if SUPERADMIN already exists
    const superAdmin = await prisma.user.findUnique({
      where: { email: 'superadmin@example.com' },
    });

    if (!superAdmin) {
      // Create SUPERADMIN user
      await prisma.user.create({
        data: {
          name: 'Super Admin',
          email: 'superadmin@example.com',
          password: await bcrypt.hash('superadmin', 10),
          role: 'SUPERADMIN',
        },
      });
      console.log('SUPERADMIN user created.');
    } else {
      console.log('SUPERADMIN already exists.');
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}

// Handle initialization
main()
  .catch((e) => {
    console.error('Initialization error:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Ensure proper database connection cleanup
    await prisma.$disconnect();
  });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

export { prisma };