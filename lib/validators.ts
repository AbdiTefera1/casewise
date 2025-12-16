/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { prisma } from './prisma';
import { NotificationType, NotificationPriority, CompanyType, Gender, ClientStatus } from '@prisma/client';

// Define Zod schemas for nested objects
const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

const ContactInfoSchema = z.object({
  phone: z.string().optional(),
  address: AddressSchema.optional(),
  alternateEmail: z.string().email().optional(),
});

// Define the main schema for CreateClientData
const CreateClientDataSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  type: z.nativeEnum(CompanyType).optional(),
  gender: z.nativeEnum(Gender).optional(),
  contactInfo: ContactInfoSchema.optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().url().optional(),
  notes: z.string().optional(),
  customFields: z.string().optional(),
  status: z.nativeEnum(ClientStatus).optional(),
});

// Example usage
export function validateCreateClientData(data: any, isUpdate = false) {
  const schema = isUpdate ? CreateClientDataSchema.partial() : CreateClientDataSchema;
  const result = schema.safeParse(data);
  
  return {
    success: result.success,
    error: result.success ? null : result.error.errors[0].message
  };
}

// Case validation
// Define the court info schema
const CourtSchema = z.object({
  courtNo: z.string(), // Court number
  courtType: z.string(), // Type of court (e.g., District, High)
  court: z.string(), // Name of the court
  judgeType: z.string(), // Type of judge (e.g., Presiding Judge)
  judgeName: z.string(), // Name of the judge
  remarks: z.string().optional() // Remarks are optional
});

// Define the main Theft Case schema for validation
const caseSchema = z.object({
  title: z.string(), // Title of the case
  description: z.string(), // Description of the case
  clientId: z.string().uuid(), // Client ID must be a valid UUID
  caseType: z.string(), // Type of case (e.g., Criminal)
  caseSubType: z.string(), // Subtype of case (e.g., Theft)
  stageOfCase: z.string(), // Current stage of the case (e.g., Investigation)
  filingNumber: z.string(), // Filing number for the case
  filingDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid filing date format" // Validate date format
  }),
  act: z.string(), // Legal act related to the case
  firstHearingDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid first hearing date format" // Validate date format
  }),
  judge: z.string().optional(),
transferDate: z.string().refine(date => !isNaN(Date.parse(date)), {
  message: "Invalid transfer date format" // Validate date format
}).optional(),
fromCourt: z.string().optional(),
toCourt: z.string().optional(),
  policeStation: z.string(), // Name of the police station involved
  firNumber: z.string(), // FIR number related to the case
  firDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid FIR date format" // Validate date format
  }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']), // Status of the case
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']), // Priority level of the case
  startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid start date format" // Validate date format
  }),
  endDate: z.string().nullable().refine(date => date === null || !isNaN(Date.parse(date)), {
    message: "Invalid end date format or should be null" // Validate date format or null
  }),
  courts: z.array(CourtSchema), // Array of court objects
  assignedToId: z.string().uuid() // Assigned lawyer ID must be a valid UUID
});

// Function to validate theft case data
export function validateCaseData(data: any) {
  const result = caseSchema.safeParse(data);
  if (!result.success) {
    console.log("Validation errors:", result.error.errors);
  }
  return {
    success: result.success,
    error: result.success ? null : result.error.errors.map(err => err.message)
  };
}

// Lawyer validator
const LawyerContactInfoSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string().min(1, { message: 'Street is required' }),
      city: z.string().min(1, { message: 'City is required' }),
      state: z.string().min(1, { message: 'State is required' }),
      zipCode: z
        .string()
        .length(5, { message: 'Zip code must be exactly 5 digits' })
        .regex(/^\d+$/, { message: 'Zip code must contain only digits' }),
    })
    .optional(),
});

const AvailabilitySchema = z.object({
  daysAvailable: z.array(z.string()),
  hoursAvailable: z.object({
    from: z
      .string()
      .regex(/^\d{2}:\d{2}$/, { message: 'Time must be in HH:mm format (e.g., 09:00)' }),
    to: z
      .string()
      .regex(/^\d{2}:\d{2}$/, { message: 'Time must be in HH:mm format (e.g., 17:00)' }),
  }),
});

const JurisdictionsSchema = z.object({
  regions: z.array(z.string()),
  countries: z.array(z.string()),
});

const lawyerRegistrationSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  name: z.string().min(1, { message: 'Name is required' }),
  specializations: z.array(z.string()),
  barNumber: z.string().min(1, { message: 'Bar number is required' }),
  licenseStatus: z.enum(['Active', 'Inactive'], {
    message: 'License status must be Active or Inactive',
  }),
  jurisdictions: JurisdictionsSchema,
  hourlyRate: z
    .number({ invalid_type_error: 'Hourly rate must be a number' })
    .positive({ message: 'Hourly rate must be greater than 0' }),
  contactInfo: LawyerContactInfoSchema,
  availability: AvailabilitySchema,
});

// Improved validation function with detailed field-specific errors
export function validateLawyerRegistrationData(data: any) {
  const result = lawyerRegistrationSchema.safeParse(data);

  if (result.success) {
    return { success: true, error: null };
  }

  // Transform Zod errors into user-friendly format with path
  const errors = result.error.errors.map((err) => {
    const path = err.path.length > 0 ? err.path.join('.') : 'root';
    return `${path}: ${err.message}`;
  });

  return {
    success: false,
    error: errors,
  };
}

// New: Partial update schema
const lawyerUpdateSchema = lawyerRegistrationSchema
  .omit({ password: true, email: true }) // Never allow updating password or top-level email
  .partial() // All remaining fields optional
  .deepPartial(); // Makes nested objects (like contactInfo.address, jurisdictions, availability) also partial

// Validation function for updates
export function validateLawyerUpdateData(data: any) {
  const result = lawyerUpdateSchema.safeParse(data);

  if (result.success) {
    return { success: true, error: null };
  }

  const errors = result.error.errors.map((err) => {
    const path = err.path.length > 0 ? err.path.join('.') : 'root';
    return `${path}: ${err.message}`;
  });

  return {
    success: false,
    error: errors,
  };
}


  // Task Validator
  const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW', 'URGENT']),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
    caseId: z.string().uuid('Invalid case ID'),
    assignedTo: z.string().uuid('Invalid assignee ID'),
    clientId: z.string().uuid('Invalid client ID'),
    startDate: z.string().transform(str => new Date(str)),
    deadline: z.string().transform(str => new Date(str)),
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
  appointmentDate: z.string().transform(str =>  new Date(str) ),
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

       if (!result.success) {
          console.log("Validation errors:", result.error.errors);
       }
    
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


const notificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  type: z.enum([
    'INVOICE_CREATED',
    'INVOICE_PAID',
    'PAYMENT_RECEIVED',
    'INVOICE_OVERDUE',
    'SYSTEM_ALERT',
    'CLIENT_MESSAGE'
  ]),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  reference: z.string().optional(),
  referenceId: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional()
});

export function validateNotificationData(data: any) {
  try {
    const validatedData = notificationSchema.parse(data);
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
      error: 'Invalid notification data'
    };
  }
}

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  reference?: string;
  referenceId?: string;
  priority?: NotificationPriority;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  reference,
  referenceId,
  priority = 'NORMAL'
}: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      reference,
      referenceId,
      priority
    }
  });
}

export async function createInvoiceNotification(
  userId: string,
  invoice: any,
  type: 'INVOICE_CREATED' | 'INVOICE_PAID' | 'INVOICE_OVERDUE'
) {
  const titles = {
    INVOICE_CREATED: 'New Invoice Created',
    INVOICE_PAID: 'Invoice Paid',
    INVOICE_OVERDUE: 'Invoice Overdue'
  };

  const messages = {
    INVOICE_CREATED: `Invoice #${invoice.invoiceNumber} has been created for ${invoice.client.name}`,
    INVOICE_PAID: `Invoice #${invoice.invoiceNumber} has been marked as paid`,
    INVOICE_OVERDUE: `Invoice #${invoice.invoiceNumber} for ${invoice.client.name} is overdue`
  };

  const priorities = {
    INVOICE_CREATED: 'NORMAL',
    INVOICE_PAID: 'NORMAL',
    INVOICE_OVERDUE: 'HIGH'
  } as const;

  return createNotification({
    userId,
    type,
    title: titles[type],
    message: messages[type],
    reference: 'invoice',
    referenceId: invoice.id,
    priority: priorities[type]
  });
}