/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }


    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, organizationId: user.organizationId, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Create the response object with user data and token
    const response = NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          organizationId: user.organizationId
        }
      },
      { status: 200 }
    );
      
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 24 hours
      });

  
      return response;
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}