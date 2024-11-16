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
  


  // document validation 

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/jpg'
];

const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  caseId: z.string().uuid('Invalid case ID'),
  description: z.string().optional(),
  category: z.enum(['PLEADING', 'EVIDENCE', 'CORRESPONDENCE', 'CONTRACT', 'OTHER']),
  file: z.custom<File>()
    .refine((file) => file !== null, 'File is required')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 100MB')
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      'Invalid file type. Accepted types: PDF, DOC, DOCX, JPG, PNG'
    )
});

export function validateDocumentData(data: any) {
  const result = documentSchema.safeParse(data);
  
  return {
    success: result.success,
    error: result.success ? null : result.error.errors[0].message
  };
}

// invoice
const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  rate: z.number().nonnegative('Rate must be non-negative'),
});

const invoiceSchema = z.object({
  clientId: z.string().uuid('Invalid client ID'),
  caseId: z.string().uuid('Invalid case ID'),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid due date format'
  }),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

type InvoiceItem = z.infer<typeof invoiceItemSchema>;

export function validateInvoiceData(data: any) {
  try {
    const validatedData = invoiceSchema.parse(data);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      success: false,
      error: 'Invalid invoice data'
    };
  }
}

interface InvoiceTotals {
  subtotal: number;
  tax: number;
  total: number;
}

export function calculateInvoiceTotals(items: InvoiceItem[]): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.rate);
  }, 0);

  // You can customize tax calculation based on your needs
  // This example uses a fixed 10% tax rate
  const TAX_RATE = 0.1;
  const tax = subtotal * TAX_RATE;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number((subtotal + tax).toFixed(2))
  };
}

const paymentSchema = z.object({
  invoiceId: z.string().uuid('Invalid invoice ID'),
  amount: z.number().positive('Amount must be positive'),
  paymentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid payment date format'
  }),
  method: z.enum(['CASH', 'CHECK', 'CREDIT_CARD', 'BANK_TRANSFER', 'OTHER']),
  reference: z.string().optional(),
  notes: z.string().optional()
});

export function validatePaymentData(data: any) {
  try {
    const validatedData = paymentSchema.parse(data);
    return {
      success: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      success: false,
      error: 'Invalid payment data'
    };
  }
}