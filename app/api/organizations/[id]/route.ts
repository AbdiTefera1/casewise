/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/organizations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { 
        id: params.id,
        deletedAt: null
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        },
        _count: {
          select: { 
            users: true,
          }
        }
      }
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this organization
    if (session.user.role !== 'ADMIN' && 
        session.user.organizationId !== organization.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ organization });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organization = await prisma.organization.findUnique({
      where: { id: params.id }
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to update
    if (session.user.role !== 'ADMIN' && 
        session.user.organizationId !== organization.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate domain format if provided
    if (data.domain) {
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
      if (!domainRegex.test(data.domain)) {
        return NextResponse.json(
          { error: 'Invalid domain format' },
          { status: 400 }
        );
      }
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: params.id },
      data: {
        name: data.name,
        domain: data.domain,
        settings: data.settings,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ organization: updatedOrganization });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth(request);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Implement soft delete with cascade
    await prisma.$transaction(async (tx) => {
      // Soft delete the organization
      await tx.organization.update({
        where: { id: params.id },
        data: { deletedAt: new Date() }
      });

      // Soft delete associated users
      await tx.user.updateMany({
        where: { organizationId: params.id },
        data: { deletedAt: new Date() }
      });

      // Soft delete associated projects
    //   await tx.project.updateMany({
    //     where: { organizationId: params.id },
    //     data: { deletedAt: new Date() }
    //   });

      // Soft delete associated documents
    //   await tx.document.updateMany({
    //     where: { organizationId: params.id },
    //     data: { deletedAt: new Date() }
    //   });
    });

    return NextResponse.json(
      { message: 'Organization and associated data deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}