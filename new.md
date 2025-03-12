// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}
// "postinstall": "prisma generate && prisma migrate deploy"
// datasource db {
//   // provider = "postgresql"
//   provider = "mysql"
//   url      = env("DATABASE_URL")
// }

// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }

datasource db {
  provider  = "postgresql"
  // url      = env("POSTGRES_PRISMA_URL")
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
// generator client {
//   provider = "prisma-client-js"
// }

// datasource db {
//   provider          = "postgresql"
//   url               = env("POSTGRES_PRISMA_URL")
//   // directUrl         = env("POSTGRES_URL_NON_POOLING")
// }

// Enums
enum UserRole {
  SUPERADMIN
  ADMIN
  LAWYER
  PARALEGAL
  USER
}

enum CaseStatus {
  ACTIVE
  INACTIVE
  ARCHIVED
}

enum CasePriority {
  HIGH
  MEDIUM
  LOW
  URGENT
}

enum ClientStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum CompanyType {
  INDIVIDUAL
  COMPANY
  NON_PROFIT
  GOVERNMENT
}

enum TaskPriority {
  HIGH
  MEDIUM
  LOW
  URGENT
}

enum TaskStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

enum AppointmentStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  RESCHEDULED
}

enum AppointmentType {
  IN_PERSON
  VIRTUAL
}

enum DocumentCategory {
  PLEADING
  EVIDENCE
  CORRESPONDENCE
  CONTRACT
  OTHER
}

enum InvoiceStatus {
  DRAFT
  UNPAID
  PAID
  VOID
  CANCELLED
}

enum PaymentMethod {
  CREDIT_CARD
  BANK_TRANSFER
  CASH
  CHECK
  OTHER
}

enum Gender {
  MALE
  FEMALE
}

enum PaymentStatus {
  COMPLETED
  PENDING
  FAILED
}

enum NotificationType {
  INVOICE_CREATED
  INVOICE_PAID
  PAYMENT_RECEIVED
  INVOICE_OVERDUE
  SYSTEM_ALERT
  CLIENT_MESSAGE
}

enum NotificationPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

// Models
model Organization {
  id          String        @id @default(uuid())
  name        String
  contactInfo Json
  domain      String        @unique
  settings    Json?
  createdById String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  deletedAt   DateTime?
  createdBy   User          @relation("CreatedOrganizations", fields: [createdById], references: [id])
  // Relations
  users       User[]
  cases       Case[]
  clients     Client[]
  Appointment Appointment[]
  Document    Document[]
  Invoice     Invoice[]
  ActivityLog ActivityLog[]
  courts      Court[]
  Task        Task[]
}

model User {
  id             String    @id @default(uuid())
  organizationId String?
  name           String?
  email          String    @unique
  password       String
  role           UserRole?
  avator         String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?

  // Relations
  organization         Organization?  @relation(fields: [organizationId], references: [id])
  cases                Case[]         @relation("LawyerCases")
  tasks                Task[]
  appointments         Appointment[]
  notifications        Notification[]
  createdOrganizations Organization[] @relation("CreatedOrganizations")
  lawyer               Lawyer?
  Document             Document[]
  Invoice              Invoice[]
  ActivityLog          ActivityLog[]

  @@index([organizationId])
}

model Court {
  id             String        @id @default(uuid())
  organizationId String?
  caseId         String
  courtNo        String
  courtType      String
  court          String
  judgeType      String
  judgeName      String
  remarks        String
  case           Case          @relation(fields: [caseId], references: [id])
  organization   Organization? @relation(fields: [organizationId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("court")
}

model Case {
  id               String        @id @default(uuid())
  organizationId   String
  clientId         String?
  lawyerId         String
  title            String
  description      String        @db.Text
  judge            String?       @db.Text
  caseType         String
  caseSubType      String
  stageOfCase      String
  filingNumber     String
  filingDate       DateTime
  act              String
  firstHearingDate DateTime?
  nextHearingDate  DateTime?
  policeStation    String
  firNumber        String
  firDate          DateTime
  transferDate     DateTime?
  fromCourt        String?
  toCourt          String?
  status           CaseStatus
  priority         CasePriority?
  caseNumber       String
  startDate        DateTime?
  endDate          DateTime?
  deletedAt        DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  // Relations
  organization Organization  @relation(fields: [organizationId], references: [id])
  client       Client?       @relation(fields: [clientId], references: [id])
  lawyer       User          @relation("LawyerCases", fields: [lawyerId], references: [id])
  tasks        Task[]
  appointments Appointment[]
  documents    Document[]
  invoices     Invoice[]
  courts       Court[]

  @@index([organizationId])
  @@index([clientId])
  @@index([lawyerId])
}

model Client {
  id             String        @id @default(uuid())
  organizationId String
  firstName      String
  middleName     String
  lastName       String?
  email          String?
  type           CompanyType?
  contactInfo    Json?
  gender         Gender?
  clientNumber   String
  companyName    String?
  industry       String?
  website        String?
  notes          String?
  customFields   String?
  status         ClientStatus?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  deletedAt      DateTime?

  // Relations
  organization Organization? @relation(fields: [organizationId], references: [id])
  cases        Case[]
  appointments Appointment[]
  invoices     Invoice[]
  Task         Task[]

  @@index([organizationId])
}

model Lawyer {
  id              String @id @default(uuid())
  userId          String @unique
  // specializations String[]
  specializations Json
  barNumber       String
  licenseStatus   String
  jurisdictions   Json
  hourlyRate      Float
  contactInfo     Json
  // availability    String[]
  availability    Json
  status          String @default("ACTIVE")

  // Relations
  user User @relation(fields: [userId], references: [id])

  @@index([barNumber])
}

model Task {
  id             String       @id @default(uuid())
  caseId         String
  assignedTo     String
  title          String
  organizationId String?
  description    String       @db.Text
  priority       TaskPriority
  status         TaskStatus
  clientId       String?
  startDate      DateTime
  deadline       DateTime
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  // Relations
  case         Case          @relation(fields: [caseId], references: [id])
  assignee     User          @relation(fields: [assignedTo], references: [id])
  client       Client?       @relation(fields: [clientId], references: [id])
  organization Organization? @relation(fields: [organizationId], references: [id])

  @@index([caseId])
  @@index([assignedTo])
}

model Appointment {
  id              String             @id @default(uuid())
  caseId          String
  clientId        String
  lawyerId        String
  title           String
  description     String
  organizationId  String?
  appointmentDate DateTime
  startTime       DateTime?
  endTime         DateTime?
  location        String
  type            AppointmentType?
  status          AppointmentStatus?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt

  // Relations
  organization Organization? @relation(fields: [organizationId], references: [id])
  case         Case          @relation(fields: [caseId], references: [id])
  client       Client        @relation(fields: [clientId], references: [id])
  lawyer       User          @relation(fields: [lawyerId], references: [id])

  @@index([caseId])
  @@index([clientId])
  @@index([lawyerId])
}

model Document {
  id          String           @id @default(uuid())
  title       String
  description String?
  category    DocumentCategory
  fileName    String
  fileSize    Int
  fileType    String
  storagePath String
  storageUrl  String

  // Relationships
  case           Case         @relation(fields: [caseId], references: [id], onDelete: Cascade)
  caseId         String
  uploadedBy     User         @relation(fields: [uploadedById], references: [id])
  uploadedById   String
  organization   Organization @relation(fields: [organizationId], references: [id])
  organizationId String

  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Indexes
  @@index([caseId])
  @@index([organizationId])
  @@index([uploadedById])
  @@index([category])
  @@index([createdAt])
}

model Invoice {
  id             String        @id @default(uuid())
  invoiceNumber  String        @unique
  clientId       String
  caseId         String?
  dueDate        DateTime
  notes          String?       @db.Text
  terms          String?       @db.Text
  status         InvoiceStatus @default(UNPAID)
  subtotal       Float
  tax            Float
  total          Float
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  organizationId String
  createdById    String

  // Relationships
  items        InvoiceItem[]
  payments     Payment[]
  client       Client        @relation(fields: [clientId], references: [id])
  case         Case?         @relation(fields: [caseId], references: [id])
  organization Organization  @relation(fields: [organizationId], references: [id])
  createdBy    User          @relation(fields: [createdById], references: [id])

  @@index([clientId])
  @@index([caseId])
  @@index([organizationId])
  @@index([status])
  @@index([createdAt])
}

model InvoiceItem {
  id          String   @id @default(uuid())
  invoiceId   String
  description String
  quantity    Float
  rate        Float
  amount      Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationship
  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId])
}

model Payment {
  id          String        @id @default(uuid())
  invoiceId   String
  amount      Float
  paymentDate DateTime
  method      PaymentMethod
  reference   String?
  notes       String?       @db.Text
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Relationship
  invoice Invoice @relation(fields: [invoiceId], references: [id])

  @@index([invoiceId])
  @@index([paymentDate])
}

model Notification {
  id          String               @id @default(uuid())
  userId      String
  type        NotificationType
  title       String
  message     String
  reference   String? // e.g., "invoice", "payment"
  referenceId String? // ID of the referenced entity
  priority    NotificationPriority @default(NORMAL)
  read        Boolean              @default(false)
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt

  // Relationship
  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([createdAt])
  @@index([type])
  @@index([read])
}

model ActivityLog {
  id             String        @id @default(cuid())
  userId         String?
  organizationId String?
  user           User?         @relation(fields: [userId], references: [id])
  organization   Organization? @relation(fields: [organizationId], references: [id])
  action         String // e.g., 'CREATE', 'UPDATE', 'DELETE'
  entity         String // e.g., 'Case', 'Client', 'Document'
  entityId       String
  details        Json?
  ipAddress      String?
  userAgent      String?
  createdAt      DateTime      @default(now())

  @@index([userId])
  @@index([entity, entityId])
  @@index([createdAt])
}








'use client';

import { useState, useRef } from 'react';
import { useUploadDocument } from '@/hooks/useDocuments';
import { useCases } from '@/hooks/useCases';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, FileText, Image, Package } from 'lucide-react';
import { DocumentCategory } from '@/lib/api/documents';

export default function UploadDocumentPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadDocument = useUploadDocument();
  const { data: casesData } = useCases({ limit: 100 });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as DocumentCategory,
    caseId: '',
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.caseId) return;

    try {
      await uploadDocument.mutateAsync({
        file: selectedFile,
        ...formData,
        organizationId: casesData?.cases[0]?.organizationId || '',
      });
      
      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setFormData({
        title: '',
        description: '',
        category: '' as DocumentCategory,
        caseId: '',
      });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="w-12 h-12 text-gray-400" />;
    if (selectedFile.type.startsWith('image/')) return <Image className="w-12 h-12 text-blue-500" />;
    if (selectedFile.type.includes('pdf')) return <FileText className="w-12 h-12 text-red-500" />;
    return <File className="w-12 h-12 text-gray-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold mb-6">Upload Document</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drag & Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFile ? 'file' : 'no-file'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                {getFileIcon()}
                
                {selectedFile ? (
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">
                      Drag and drop your file here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supports: PDF, DOC, DOCX, JPG, PNG (up to 10MB)
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {preview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
              </motion.div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as DocumentCategory }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                <option value="CORRESPONDENCE">CORRESPONDENCE</option>
                <option value="PLEADING">PLEADING</option>
                <option value="EVIDENCE">Evidence</option>
                <option value="CONTRACT">CONTRACT</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Case
              </label>
              <select
                value={formData.caseId}
                onChange={(e) => setFormData(prev => ({ ...prev, caseId: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select case</option>
                {casesData?.cases.map(case_ => (
                  <option key={case_.id} value={case_.id}>
                    {case_.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={!selectedFile || uploadDocument.isPending}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium
              ${!selectedFile || uploadDocument.isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {uploadDocument.isPending ? (
              <span className="flex items-center justify-center">
                <Package className="w-5 h-5 animate-spin mr-2" />
                Uploading...
              </span>
            ) : (
              'Upload Document'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}