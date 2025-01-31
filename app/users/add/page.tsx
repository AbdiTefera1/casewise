"use client";

import { useForm } from 'react-hook-form';
import { useOrganizations } from '@/hooks/useOrganization';
import { useCreateUser } from '@/hooks/useUsers';
import { RegisterData, UserRole } from '@/lib/api/users';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegistrationForm() {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<RegisterData>();
  const { data: organizations, isLoading: orgsLoading, error: orgsError } = useOrganizations();
  const { mutate, isPending, isSuccess, error: apiError } = useCreateUser();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const onSubmit = (data: RegisterData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        router.push("/users");
      }
    });
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      // Simulate upload - replace with actual API call
      const uploadedUrl = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(file));
        }, 1000);
      });
      
      setAvatarPreview(uploadedUrl);
      setValue('avator', uploadedUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, [setValue]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Join Our Community</h2>
      
      {isSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          Registration successful! Welcome aboard 🎉
        </div>
      )}

      {apiError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {apiError.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name, Email, and Password fields remain the same */}

         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className={`w-full px-4 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="John Doe"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="john@example.com"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            className={`w-full px-4 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="••••••••"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="absolute opacity-0 w-full h-full cursor-pointer"
                id="avatarUpload"
                disabled={isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleFileUpload(file);
                  }
                }}
              />
              <label
                htmlFor="avatarUpload"
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                  isUploading ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                {isUploading ? (
                  <span className="text-gray-600">Uploading...</span>
                ) : (
                  <span className="text-gray-600">
                    {avatarPreview ? 'Change Image' : 'Choose File'}
                  </span>
                )}
              </label>
            </div>
            
            {avatarPreview && (
              <div className="relative">
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAvatarPreview('');
                    setValue('avator', '');
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            {...register('role')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            defaultValue={UserRole.USER}
          >
            <option value={UserRole.SUPERADMIN}>Super Admin</option>
            <option value={UserRole.ADMIN}>Administrator</option>
            <option value={UserRole.USER}>Regular User</option>
          </select>
        </div>

        {/* Organization select remains the same */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
          {orgsLoading ? (
            <div className="animate-pulse p-4 bg-gray-100 rounded-lg">Loading organizations...</div>
          ) : orgsError ? (
            <div className="text-red-500 text-sm">Error loading organizations</div>
          ) : (
            <select
              {...register('organizationId')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">Select an organization</option>
              {organizations?.organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || isUploading}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
            isPending || isUploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors`}
        >
          {isPending ? 'Registering...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}