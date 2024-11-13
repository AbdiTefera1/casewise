/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/appointments
// Retrieve all appointments with optional filters for client, lawyer, date, and pagination
export async function GET(request: Request) {
    try {
      const url = new URL(request.url);
      const clientId = url.searchParams.get('clientId');
      const lawyerId = url.searchParams.get('lawyerId');
      const date = url.searchParams.get('date');
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const skip = (page - 1) * limit; // Pagination calculation
  
      // Fetch appointments with pagination and filters
      const appointments = await prisma.appointment.findMany({
        where: {
          clientId: clientId ? parseInt(clientId) : undefined,
          lawyerId: lawyerId ? parseInt(lawyerId) : undefined,
          date: date ? new Date(date) : undefined,
        },
        include: {
          client: true,  // Include client details
          case: true,    // Include case details
          Lawyer: true,  // Include lawyer details (optional)
        },
        skip,           // Skip appointments based on the page
        take: limit,    // Limit number of results per page
        orderBy: {
          date: 'asc',   // Optional: Sort by date in ascending order
        },
      });
  
      // Get total count of appointments for pagination metadata
      const totalAppointments = await prisma.appointment.count({
        where: {
          clientId: clientId ? parseInt(clientId) : undefined,
          lawyerId: lawyerId ? parseInt(lawyerId) : undefined,
          date: date ? new Date(date) : undefined,
        },
      });
  
      const totalPages = Math.ceil(totalAppointments / limit);
  
      return new Response(
        JSON.stringify({
          appointments,
          pagination: {
            currentPage: page,
            totalPages,
            totalAppointments,
          },
        }),
        { status: 200 }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch appointments' }),
        { status: 500 }
      );
    }
  }


  // POST /api/appointments
// Schedule a new appointment
export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { title, date, location, clientId, caseId, lawyerId } = body;
  
      const appointment = await prisma.appointment.create({
        data: {
          title,
          date: new Date(date),
          location,
          clientId,
          caseId,
          lawyerId: lawyerId ? parseInt(lawyerId) : null,
        },
      });
  
      return new Response(JSON.stringify(appointment), {
        status: 201,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to create appointment' }),
        { status: 500 }
      );
    }
  }
  