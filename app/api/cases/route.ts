/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Extract query parameters for filtering and pagination
    const url = new URL(request.url);
    const status = url.searchParams.get('status'); // Filter by case status (OPEN, CLOSED, PENDING, etc.)
    const clientId = url.searchParams.get('clientId'); // Filter by client ID
    const lawyerId = url.searchParams.get('lawyerId'); // Filter by lawyer ID
    const priority = url.searchParams.get('priority'); // Filter by priority (LOW, MEDIUM, HIGH, URGENT)
    
    // Pagination parameters
    const page = parseInt(url.searchParams.get('page') || '1'); // Default to page 1
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10'); // Default to 10 items per page
    const skip = (page - 1) * pageSize; // Calculate the number of items to skip

    // Define valid enum values for CaseStatus and CasePriority
    const validStatuses = ['OPEN', 'CLOSED', 'PENDING', 'ARCHIVED'];
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

    // Ensure that the status and priority are valid enums, otherwise set them to undefined
    const validStatus = validStatuses.includes(status?.toUpperCase() as string) ? status?.toUpperCase() : undefined;
    const validPriority = validPriorities.includes(priority?.toUpperCase() as string) ? priority?.toUpperCase() : undefined;

    // Retrieve cases from the database with filtering and pagination
    const cases = await prisma.case.findMany({
      where: {
        ...(validStatus && { status: validStatus as any }),
        ...(clientId && { clientId: parseInt(clientId) }),
        ...(lawyerId && { lawyerId: parseInt(lawyerId) }),
        ...(validPriority && { priority: validPriority as any }),
      },
      skip,
      take: pageSize, // Limit the number of cases returned
      include: {
        client: true,
        lawyer: true,
        tasks: true,
        appointment: true,
        document: true,
        invoice: true,
      },
    });

    // Get the total count for pagination
    const totalCount = await prisma.case.count({
      where: {
        ...(validStatus && { status: validStatus as any }),
        ...(clientId && { clientId: parseInt(clientId) }),
        ...(lawyerId && { lawyerId: parseInt(lawyerId) }),
        ...(validPriority && { priority: validPriority as any }),
      },
    });

    // Return cases and pagination info
    return new Response(
      JSON.stringify({
        cases,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response('Something went wrong', { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
      const { title, description, status, priority, clientId, lawyerId, deadline } = await request.json();
  
      const newCase = await prisma.case.create({
        data: {
          title,
          description,
          status,
          priority,
          clientId,
          lawyerId,
          deadline,
        },
      });
  
      return new Response(JSON.stringify(newCase), { status: 201 });
    } catch (error) {
      console.error(error);
      return new Response('Failed to create case', { status: 500 });
    }
  }