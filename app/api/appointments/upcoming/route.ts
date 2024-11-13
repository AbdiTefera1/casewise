/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/appointments/upcoming
// Fetch upcoming appointments (useful for dashboard overview)
export async function GET_UPCOMING(request: Request) {
    try {
      const page = parseInt(new URL(request.url).searchParams.get('page') || '1');
      const limit = parseInt(new URL(request.url).searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;
  
      const upcomingAppointments = await prisma.appointment.findMany({
        where: {
          date: {
            gte: new Date(), // Fetch appointments where date is greater than or equal to today
          },
        },
        include: {
          client: true, // Include client details
          case: true,   // Include case details
          Lawyer: true, // Include lawyer details (optional)
        },
        skip,           // Skip appointments based on the page
        take: limit,    // Limit number of results per page
        orderBy: {
          date: 'asc',   // Sort by date in ascending order
        },
      });
  
      // Get total count of upcoming appointments for pagination metadata
      const totalAppointments = await prisma.appointment.count({
        where: {
          date: {
            gte: new Date(),
          },
        },
      });
  
      const totalPages = Math.ceil(totalAppointments / limit);
  
      return new Response(
        JSON.stringify({
          appointments: upcomingAppointments,
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
        JSON.stringify({ error: 'Failed to fetch upcoming appointments' }),
        { status: 500 }
      );
    }
  }