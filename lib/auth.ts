/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/auth.ts
import * as jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import * as bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function auth(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization');

   const tokenFromCookies = request.cookies.get("token")
  //  console.log("Token from cookies: ", tokenFromCookies)
  //  console.log("Token value: ", tokenFromCookies?.value)

    if(!tokenFromCookies) {
      console.warn("Authorization cookies missed!")
    }

    if (!authorization?.startsWith('Bearer ')) {
      console.warn('Authorization header missing or invalid');
      return null;
    }

    const token = authorization.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    // console.log('Decoded Token:', decoded);

    const decodedCookies = jwt.verify(tokenFromCookies?.value as string, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    // console.log("Decoded cookies: ", decodedCookies)

    const user = await prisma.user.findUnique({
      where: { id: decodedCookies.userId },
      select: {
        id: true,
        email: true,
        role: true,
        organizationId: true,
        name: true
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