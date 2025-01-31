"use client";

import { useForm } from 'react-hook-form';
import { useCreateOrganization } from '@/hooks/useOrganization';
import { useState, useCallback } from 'react';
import { CreateOrganizationData } from '@/lib/api/organizations'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CreateOrganizationForm() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateOrganizationData>();
  const { mutate, isPending, isSuccess, error: apiError } = useCreateOrganization();
  const [logoPreview, setLogoPreview] = useState('');
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const router = useRouter();

  const primaryColor = watch('settings.theme.primaryColor') || '#3b82f6';

  const onSubmit = (data: CreateOrganizationData) => {
    mutate(data, {
      onSuccess: () => router.push("/organizations")
    });
  };

  const handleLogoUpload = useCallback(async (file: File) => {
    setIsLogoUploading(true);
    try {
      // Simulate file upload - replace with actual API call
      const uploadedUrl = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(file));
        }, 1000);
      });
      
      setLogoPreview(uploadedUrl);
      setValue('settings.theme.logoUrl', uploadedUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLogoUploading(false);
    }
  }, [setValue]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New Organization</h2>

      {isSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          Organization created successfully! 🎉
        </div>
      )}

      {apiError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {apiError.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className={`w-full px-4 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Acme Corp"
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain *</label>
            <input
              {...register('domain', { required: 'Domain is required' })}
              className={`w-full px-4 py-2 border rounded-lg ${errors.domain ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="acme.com"
            />
            {errors.domain && <span className="text-red-500 text-sm">{errors.domain.message}</span>}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                {...register('contactInfo.address')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="123 Main St"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                {...register('contactInfo.phone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register('contactInfo.email')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="contact@acme.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                {...register('contactInfo.website')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://acme.com"
              />
            </div>
          </div>
        </div>

        {/* Theme Settings Section */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800">Theme Settings</h3>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  {...register('settings.theme.primaryColor')}
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <span className="text-gray-600">{primaryColor}</span>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Logo</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/svg+xml"
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                    id="logoUpload"
                    disabled={isLogoUploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        await handleLogoUpload(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="logoUpload"
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                      isLogoUploading ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    {isLogoUploading ? (
                      <span className="text-gray-600">Uploading...</span>
                    ) : (
                      <span className="text-gray-600">
                        {logoPreview ? 'Change Logo' : 'Upload Logo'}
                      </span>
                    )}
                  </label>
                </div>
                
                {logoPreview && (
                  <div className="relative">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-contain bg-gray-100 p-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoPreview('');
                        setValue('settings.theme.logoUrl', '');
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Billing Settings Section */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800">Billing Settings</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
              <select
                {...register('settings.billing.plan')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
              <select
                {...register('settings.billing.billingCycle')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feature Flags Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Feature Flags</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {['analytics', 'sso', 'reporting', 'multi_team'].map((feature) => (
              <label key={feature} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register(`settings.features.${feature}`)}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
                <span className="capitalize">{feature.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || isLogoUploading}
          className={`w-full py-3 px-6 rounded-lg text-white font-medium ${
            isPending || isLogoUploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors`}
        >
          {isPending ? 'Creating Organization...' : 'Create Organization'}
        </button>
      </form>
    </div>
  );
}