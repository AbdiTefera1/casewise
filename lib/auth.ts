/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/auth.ts
import * as jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import * as bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function auth(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      return null;
    }

    const token = authorization.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        organizationId: true
      }
    });

    if (!user) {
      return null;
    }

    return { user };
    
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string){
 return await bcrypt.hash(password, 10);
}