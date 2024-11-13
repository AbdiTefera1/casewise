/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/appointments/:id
// Retrieve details of a specific appointment by ID
export async function GET(request: Request) {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
  
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Appointment ID is required' }),
          { status: 400 }
        );
      }
  
      const appointment = await prisma.appointment.findUnique({
        where: { id: parseInt(id) },
        include: {
          client: true, // Include client details
          case: true,   // Include case details
          Lawyer: true, // Include lawyer details
        },
      });
  
      if (!appointment) {
        return new Response(
          JSON.stringify({ error: 'Appointment not found' }),
          { status: 404 }
        );
      }
  
      return new Response(JSON.stringify(appointment), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch appointment' }),
        { status: 500 }
      );
    }
  }


  // PUT /api/appointments/:id
// Update appointment details
export async function PUT(request: Request) {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
  
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Appointment ID is required' }),
          { status: 400 }
        );
      }
  
      const body = await request.json();
      const { title, date, location, clientId, caseId, lawyerId } = body;
  
      const updatedAppointment = await prisma.appointment.update({
        where: { id: parseInt(id) },
        data: {
          title,
          date: new Date(date),
          location,
          clientId,
          caseId,
          lawyerId: lawyerId ? parseInt(lawyerId) : null,
        },
      });
  
      return new Response(JSON.stringify(updatedAppointment), {
        status: 200,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to update appointment' }),
        { status: 500 }
      );
    }
  }
  
  // DELETE /api/appointments/:id
  // Cancel an appointment
  export async function DELETE(request: Request) {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split('/').pop();
  
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Appointment ID is required' }),
          { status: 400 }
        );
      }
  
      await prisma.appointment.delete({
        where: { id: parseInt(id) },
      });
  
      return new Response(null, { status: 204 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to cancel appointment' }),
        { status: 500 }
      );
    }
  }