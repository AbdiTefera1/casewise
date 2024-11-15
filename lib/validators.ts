/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/validators.ts
import { z } from 'zod';

// Client Validator
const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  type: z.enum(['INDIVIDUAL', 'COMPANY']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url().optional().nullable(),
  notes: z.string().optional(),
  customFields: z.record(z.any()).optional()
});

export function validateClientData(data: any, isUpdate = false) {
  const schema = isUpdate ? clientSchema.partial() : clientSchema;
  const result = schema.safeParse(data);
  
  return {
    success: result.success,
    error: result.success ? null : result.error.errors[0].message
  };
}

// Lawyer validator
const contactInfoSchema = z.object({
    phone: z.string().optional(),
    mobile: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional()
    }).optional(),
    emergencyContact: z.object({
      name: z.string().optional(),
      relationship: z.string().optional(),
      phone: z.string().optional()
    }).optional()
  }).strict();
  
  const availabilitySchema = z.object({
    schedule: z.array(z.object({
      day: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
      startTime: z.string(),
      endTime: z.string()
    })).optional(),
    vacations: z.array(z.object({
      startDate: z.string(),
      endDate: z.string(),
      note: z.string().optional()
    })).optional()
  }).strict();
  
  const lawyerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8).optional(),
    name: z.string().min(1, 'Name is required'),
    specializations: z.array(z.string()),
    barNumber: z.string(),
    licenseStatus: z.string(),
    jurisdictions: z.array(z.string()),
    hourlyRate: z.number().positive(),
    contactInfo: contactInfoSchema,
    availability: availabilitySchema
  });
  
  export function validateLawyerData(data: any, isUpdate = false) {
    const schema = isUpdate ? lawyerSchema.partial() : lawyerSchema;
    const result = schema.safeParse(data);
    
    return {
      success: result.success,
      error: result.success ? null : result.error.errors[0].message
    };
  }

  // Task Validator
  const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW', "URGENT"]),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']),
    dueDate: z.string().transform(str => new Date(str)),
    caseId: z.string().uuid('Invalid case ID')
  });
  
  export function validateTaskData(data: any, isUpdate = false) {
    const schema = isUpdate ? taskSchema.partial() : taskSchema;
    const result = schema.safeParse(data);
    
    return {
      success: result.success,
      error: result.success ? null : result.error.errors[0].message
    };
  }


  // Appointment validator
  const appointmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  startTime: z.string().transform(str =>  new Date(str) ),  // Can be null
  endTime: z.string().transform(str => new Date(str) ),    // Can be null
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['IN_PERSON', 'VIRTUAL']),
  lawyerId: z.string().uuid('Invalid lawyer ID'),
  clientId: z.string().uuid('Invalid client ID'),
  caseId: z.string().uuid('Invalid case ID').optional(),  // Can be optional
  organizationId: z.string().uuid('Invalid organization ID').optional(),  // Can be optional
  }).refine(data => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  }, {
    message: 'End time must be after start time',
    path: ['endTime']
  });
  
  // Updated validator for optional updates
  export function validateAppointmentData(data: any, isUpdate = false) {
    const schema = isUpdate 
      ? appointmentSchema
      : appointmentSchema;
    
    const result = schema.safeParse(data);
    
    return {
      success: result.success,
      error: result.success ? null : result.error.errors[0].message
    };
  }
  