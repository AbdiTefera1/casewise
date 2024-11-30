/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, role, name } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name 
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error ${error}` },
      { status: 500 }
    );
  }
}