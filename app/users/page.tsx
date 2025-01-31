'use client';

import { useUsers } from '@/hooks/useUsers';
import Link from 'next/link';
import { FaEdit, FaEye } from 'react-icons/fa';

const UserPage = () => {
    const { data, isLoading, error } = useUsers()

    if (isLoading) return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );

      if (error) return <div className="flex justify-center p-8 text-red-500">Error loading lawyers</div>;
      
      
  return (
    <div className='p-6'>
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Link 
          href="/users/add" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add User
        </Link>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b px-4 py-2 text-left">No</th>
              <th 
                className="border-b px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
              >
                Name
              </th>
              <th className="border-b px-4 py-2 text-left">Email</th>
              <th className="border-b px-4 py-2 text-left">Organization Name</th>
              <th className="border-b px-4 py-2 text-left">Organization contactInfo</th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">{index + 1}</td>
                <td className="border-b px-4 py-2 text-blue-600">{user.name}</td>
                <td className="border-b px-4 py-2">{user.email}</td>
                <td className="border-b px-4 py-2">{user.organization.name}</td>
                <td className="border-b px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {user.organization.contactInfo.email}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {user.organization.contactInfo.phone}
                      </span>
                  </div>
                </td>
                <td className="border-b px-4 py-2 flex justify-center gap-2">
                  <Link className="text-[#4CAF50] hover:text-gray-600" href={`/users/${user.id}/edit`}>
                    <FaEdit size={24}/>
                  </Link>
                  <Link className="text-[#24A0ED] hover:text-gray-600" href={`/users/${user.id}`}>
                    <FaEye size={24}/>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserPage;