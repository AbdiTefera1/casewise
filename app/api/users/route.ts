/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth(request);
    
    if (!session || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const [users, total] =await Promise.all([ prisma.user.findMany({
      where: { role: "ADMIN" },
      // select: {
      //   id: true,
      //   email: true,
      //   role: true,
      //   organizationId: true,
      //   createdAt: true,
      //   updatedAt: true
      // },
      include: {
        organization: true
      }
    }),
    prisma.user.count({ where: { role: "ADMIN" } })
  ]);

  const usersWithoutPasswords = users.map(user => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  })
    return NextResponse.json({ users: usersWithoutPasswords, total });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}