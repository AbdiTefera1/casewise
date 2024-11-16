/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/documents/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { storage } from '@/lib/storage';
import { validateDocumentData } from '@/lib/validators';
import { DocumentCategory, Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await auth(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.organizationId === null){
        throw new Error("Organization Id cannot null!");
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('caseId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    const validationResult = validateDocumentData({
      title,
      caseId,
      category,
      file
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // Check if case exists and user has access
    const caseRecord = await prisma.case.findFirst({
      where: {
        id: caseId,
        organizationId: session.user.organizationId
      }
    });

    if (!caseRecord) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${caseId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Upload file to storage
    const uploadResult = await storage.upload(file, fileName);

    // Create document record
    const document = await prisma.document.create({
      data: {
        title,
        description,
        category: category as DocumentCategory,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        storagePath: fileName,
        storageUrl: uploadResult.url,
        caseId,
        uploadedById: session.user.id,
        organizationId: session.user.organizationId
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        case: {
          select: {
            id: true,
            title: true,
            caseNumber: true
          }
        }
      }
    });

    return NextResponse.json({ document }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.organizationId === null){
        throw new Error("Organization Id cannot null!");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where: Prisma.DocumentWhereInput = {
      organizationId: session.user.organizationId,
      category: category as DocumentCategory || undefined,
      OR: search ? [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } },
        { case: { title: { contains: search, mode: 'insensitive' } } }
      ] : undefined
    };

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          case: {
            select: {
              id: true,
              title: true,
              caseNumber: true
            }
          }
        }
      }),
      prisma.document.count({ where })
    ]);

    return NextResponse.json({
      documents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}