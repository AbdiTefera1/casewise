/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/documents/download/[...filepath]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { storage } from '@/lib/storage';

export async function GET(
    request: NextRequest,
  { params }: { params: Promise<{ filepath: string[] }> }
) {
  try {
    const { filepath } = await params; 
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

    const filePath = filepath.join('/');

    // Verify document exists in database and user has access
    const document = await prisma.document.findFirst({
      where: {
        storagePath: filePath,
        organizationId: session.user.organizationId
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const { absolutePath } = await storage.getFilePath(filePath);
    
    // Verify file exists
    try {
      await stat(absolutePath);
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Create read stream
    const stream = createReadStream(absolutePath);

    // Return file stream
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': document.fileType,
        'Content-Disposition': `attachment; filename="${document.fileName}"`,
      },
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}