/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { storage } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
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



    const document = await prisma.document.findFirst({
      where: {
        id,
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

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // const downloadUrl = await storage.getFilePath(document.storagePath); // 1 hour expiry
    const { apiUrl } = await storage.getFilePath(document.storagePath);

    // console.log('Download URL:', downloadUrl);
    return NextResponse.json({
      document: {
        ...document,
        downloadUrl: apiUrl,
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
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

    const document = await prisma.document.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete from storage
    await storage.delete(document.storagePath);

    // Delete from database
    await prisma.document.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}