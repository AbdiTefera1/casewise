"use client"

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaPhone, FaBuilding, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import { useUser, useDeleteUser } from '@/hooks/useUsers';

const UserProfilePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {data, isLoading} = useUser(id)
  const {mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleDelete = () => {
    deleteUser(id as string, {
        onSuccess: () => router.push("/users")
    })
    setShowDeleteModal(false);
    router.push('/users');
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <FaArrowLeft className="mr-2" />
        Back to Users
      </button>

      {/* Profile Container */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative">
            <Image
              src={data?.user.avator || ""}
              alt={data?.user.name || ""}
              className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.png';
              }}
            />
            <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm ${
              data?.user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
              data?.user.role === 'LAWYER' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {data?.user.role}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{data?.user.name}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope />
                  <a href={`mailto:${data?.user.email}`} className="hover:text-blue-600">
                    {data?.user.email}
                  </a>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  onClick={() => router.push(`/users/${id}/edit`)}
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                <button
                  disabled={isDeleting}
                  className={`px-4 py-2 ${
                    isDeleting ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                  } text-white rounded-lg transition-colors`}
                  onClick={() => setShowDeleteModal(true)}
                >
                  
                  {isDeleting ? 'Deleting...' : (<FaTrash className="mr-2" />)}
                </button>
              </div>
            </div>

            {/* Organization Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaBuilding className="text-blue-600" />
                <h3 className="font-semibold">{data?.user.organization.name}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  <span>{data?.user.organization.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  <span>{data?.user.organization.contactInfo.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Details</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-gray-500">Registered Date</dt>
                {/* <dd>{new Date(data?.user.createdAt || "-").toLocaleDateString()}</dd> */}
              </div>
              <div>
                <dt className="text-sm text-gray-500">Last Updated</dt>
                {/* <dd>{new Date(data?.user.updatedAt).toLocaleDateString()}</dd> */}
              </div>
            </dl>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">System Information</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-gray-500">User ID</dt>
                <dd className="font-mono text-sm break-all">{data?.user.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default UserProfilePage;