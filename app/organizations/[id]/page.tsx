"use client";

import { useOrganization, useDeleteOrganization } from '@/hooks/useOrganization';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { use, useState } from 'react';
import Link from 'next/link';


// Confirmation Modal Component
function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel"
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
  }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md animate-in fade-in-zoom">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  }
  

export default function OrganizationView({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
  const { data, isLoading, error } = useOrganization(id as string);
  const { mutate: deleteOrganization, isPending: isDeleting, error: deleteError } = useDeleteOrganization();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteConfirm = () => {
    deleteOrganization(id as string, {
      onSuccess: () => router.push('/organizations')
    });
    setShowDeleteConfirm(false);
  };

  if (isLoading) return <div className="text-center p-8">Loading organization...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error loading organization: {error.message}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{data?.organization?.name}</h2>
        <div className="flex gap-2">
          <Link
            href={`/organizations/${id}/edit`}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className={`px-4 py-2 ${
              isDeleting ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            } text-white rounded-lg transition-colors`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Organization"
        message="Are you sure you want to delete this organization? This action cannot be undone."
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
      />

      {deleteError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Delete error: {deleteError.message}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Domain</label>
              <p className="mt-1 text-gray-900">{data?.organization?.domain}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <p className="mt-1 text-gray-900">{data?.organization?.contactInfo?.address || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <p className="mt-1 text-gray-900">{data?.organization?.contactInfo?.phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="mt-1 text-gray-900">{data?.organization?.contactInfo?.email || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Website</label>
              <p className="mt-1 text-gray-900">{data?.organization?.contactInfo?.website || '-'}</p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800">Theme Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Primary Color</label>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: data?.organization?.settings?.theme?.primaryColor }}
                ></div>
                <span className="text-gray-900">
                  {data?.organization?.settings?.theme?.primaryColor}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Logo</label>
              {data?.organization?.settings?.theme?.logoUrl ? (
                <Image
                  src={data?.organization.settings.theme.logoUrl}
                  alt="Organization logo"
                  width={64}
                  height={64}
                  className="mt-1 w-16 h-16 object-contain"
                />
              ) : (
                <p className="mt-1 text-gray-900">-</p>
              )}
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-800">Billing Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Plan</label>
              <p className="mt-1 text-gray-900 capitalize">
                {data?.organization?.settings?.billing?.plan || '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Billing Cycle</label>
              <p className="mt-1 text-gray-900 capitalize">
                {data?.organization?.settings?.billing?.billingCycle || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Enabled Features</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data?.organization?.settings?.features || {}).map(([feature, enabled]) => (
              <div key={feature} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="capitalize">{feature.replace('_', ' ')}</span>
              </div>
            ))}
            {!data?.organization?.settings?.features && (
              <p className="text-gray-500">No features enabled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}