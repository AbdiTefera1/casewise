/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateClientData } from '@/lib/validators';

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

    if(session.user.organizationId === null){
        throw new Error("organizationId cannot be null");
    }

    const client = await prisma.client.findUnique({
      where: {
        id: params.id,
        organizationId: session.user.organizationId,
        deletedAt: null
      },
      include: {
        cases: {
          where: {
            deletedAt: null
          },
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            lawyer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
      }
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ client });
    
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

    if(session.user.organizationId === null){
        throw new Error("Organization Id connot null!")
    }

    const data = await request.json();
    
    // Validate client data
    const validationResult = validateClientData(data, true);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // Get current client data for comparison
    const currentClient = await prisma.client.findUnique({
      where: {
        id: params.id,
        organizationId: session.user.organizationId
      },
      select: {
        status: true,
        type: true
      }
    });

    if (!currentClient) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Track changes for activity log
    const changes: Record<string, { from: any; to: any }> = {};
    if (data.status && data.status !== currentClient.status) {
      changes['status']  = {
        from: currentClient.status,
        to: data.status
      };
    }
    if (data.type && data.type !== currentClient.type) {
      changes['type'] = {
        from: currentClient.type,
        to: data.type
      };
    }

    const [updatedClient] = await prisma.$transaction([
      prisma.client.update({
        where: {
          id: params.id,
          organizationId: session.user.organizationId
        },
        data: {
          ...data,
          updatedAt: new Date()
        }
      }),
    //   prisma.clientActivity.create({
    //     data: {
    //       clientId: params.id,
    //       userId: session.user.id,
    //       type: 'UPDATE',
    //       changes
    //     }
    //   })
    ]);

    return NextResponse.json({ client: updatedClient });
    
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
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if(session.user.organizationId === null){
        throw new Error("Organization Id connot null!");
    }

    // Check for active cases
    const activeCases = await prisma.case.count({
      where: {
        clientId: params.id,
        status: {
          in: ['ACTIVE', 'PENDING']
        },
        deletedAt: null
      }
    });

    if (activeCases > 0) {
      return NextResponse.json(
        { error: 'Cannot delete client with active cases' },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.client.update({
        where: {
          id: params.id,
          organizationId: session.user.organizationId
        },
        data: {
          deletedAt: new Date(),
          status: 'INACTIVE'
        }
      }),
    //   prisma.clientActivity.create({
    //     data: {
    //       clientId: params.id,
    //       userId: session.user.id,
    //       type: 'DELETE'
    //     }
    //   })
    ]);

    return NextResponse.json(
      { message: 'Client deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}