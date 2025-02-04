// app/clients/[id]/edit/page.tsx
'use client';

import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useClient, useUpdateClient } from '@/hooks/useClients';
import { CompanyType, ClientStatus, UpdateClientData } from '@/lib/api/clients';

export default function UpdateClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basicInfo');
  
  const { data, isLoading } = useClient(id);
  const client = data?.client;

  const { 
    register, 
    handleSubmit, 
    watch, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<UpdateClientData>();

  const companyType = watch('type');
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();

  // Initialize form with client data
  useEffect(() => {
    if (client) {
      reset({
        ...client,
        contactInfo: client.contactInfo || {},
        companyName: client.type === CompanyType.COMPANY ? client.companyName : undefined,
        industry: client.type === CompanyType.COMPANY ? client.industry : undefined,
        website: client.type === CompanyType.COMPANY ? client.website : undefined
      });
    }
  }, [client, reset]);

  const onSubmit = async (formData: UpdateClientData) => {
    try {
      await updateClient({ id, ...formData });
      router.push('/clients');
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl text-gray-600 mb-4">
          Edit Client: {client?.firstName} {client?.lastName}
        </h1>

        <div className="border-b mb-6">
          <div className="flex gap-4">
            <TabButton 
              active={activeTab === 'basicInfo'} 
              onClick={() => setActiveTab('basicInfo')}
            >
              Basic Information
            </TabButton>
            <TabButton 
              active={activeTab === 'contact'} 
              onClick={() => setActiveTab('contact')}
            >
              Contact Details
            </TabButton>
            <TabButton 
              active={activeTab === 'additional'} 
              onClick={() => setActiveTab('additional')}
            >
              Additional Info
            </TabButton>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {activeTab === 'basicInfo' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField label="First Name" error={errors.firstName?.message}>
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    className="form-input w-full"
                  />
                </FormField>

                <FormField label="Middle Name" error={errors.middleName?.message}>
                  <input
                    {...register('middleName')}
                    className="form-input w-full"
                  />
                </FormField>

                <FormField label="Last Name" error={errors.lastName?.message}>
                  <input
                    {...register('lastName')}
                    className="form-input w-full"
                  />
                </FormField>

                <FormField label="Email" error={errors.email?.message}>
                  <input
                    type="email"
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="form-input w-full"
                  />
                </FormField>

                <FormField label="Company Type" error={errors.type?.message}>
                  <select
                    {...register('type')}
                    className="form-select w-full"
                    defaultValue={client?.type}
                  >
                    {Object.values(CompanyType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Status" error={errors.status?.message}>
                  <select
                    {...register('status')}
                    className="form-select w-full"
                    defaultValue={client?.status}
                  >
                    {Object.values(ClientStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              {companyType === CompanyType.COMPANY && (
                <div className="space-y-4">
                  <FormField label="Company Name" error={errors.companyName?.message}>
                    <input
                      {...register('companyName')}
                      className="form-input w-full"
                    />
                  </FormField>

                  <FormField label="Industry" error={errors.industry?.message}>
                    <input
                      {...register('industry')}
                      className="form-input w-full"
                    />
                  </FormField>

                  <FormField label="Website" error={errors.website?.message}>
                    <input
                      {...register('website')}
                      className="form-input w-full"
                    />
                  </FormField>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField label="Phone" error={errors.contactInfo?.phone?.message}>
                  <input
                    {...register('contactInfo.phone')}
                    className="form-input w-full"
                  />
                </FormField>

                <FormField label="Alternate Email" error={errors.contactInfo?.alternateEmail?.message}>
                  <input
                    type="email"
                    {...register('contactInfo.alternateEmail')}
                    className="form-input w-full"
                  />
                </FormField>

                <FormField label="Street" error={errors.contactInfo?.address?.street?.message}>
                  <input
                    {...register('contactInfo.address.street')}
                    className="form-input w-full"
                  />
                </FormField>

                <FormField label="City" error={errors.contactInfo?.address?.city?.message}>
                  <input
                    {...register('contactInfo.address.city')}
                    className="form-input w-full"
                  />
                </FormField>

                <FormField label="State" error={errors.contactInfo?.address?.state?.message}>
                  <input
                    {...register('contactInfo.address.state')}
                    className="form-input w-full"
                  />
                </FormField>

                <FormField label="Country" error={errors.contactInfo?.address?.country?.message}>
                  <input
                    {...register('contactInfo.address.country')}
                    className="form-input w-full"
                  />
                </FormField>

                <FormField label="Postal Code" error={errors.contactInfo?.address?.postalCode?.message}>
                  <input
                    {...register('contactInfo.address.postalCode')}
                    className="form-input w-full"
                  />
                </FormField>
              </div>
            </div>
          )}

          {activeTab === 'additional' && (
            <div className="space-y-4">
              <FormField label="Notes" error={errors.notes?.message}>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="form-textarea w-full"
                />
              </FormField>

              <FormField label="Custom Fields" error={errors.customFields?.message}>
                <textarea
                  {...register('customFields')}
                  rows={4}
                  className="form-textarea w-full"
                />
              </FormField>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUpdating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {(isSubmitting || isUpdating) ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// TabButton and FormField components remain the same

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function TabButton({ children, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-3 font-medium ${
        active 
          ? 'border-b-2 border-blue-500 text-blue-500' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}