"use client";

import { useState } from 'react';
import { useOrganizations } from '@/hooks/useOrganization'
import Link from 'next/link';
import { FaEdit, FaEye } from 'react-icons/fa';

interface SortConfig {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }

const OrganizationPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortConfig>({
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [domainFilter, setDomainFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  const { data, isLoading} = useOrganizations({
    page,
    limit,
    search,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder
  })
  

  const handleSort = (column: string) => {
    setSort(prev => ({
        sortBy: column,
        sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }

  const getSortIcon = (column: string) => {
    if (sort.sortBy !== column) return '↕';
    return sort.sortOrder === 'asc' ? '↑' : '↓';
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
  return (
    <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Organizations</h1>
      <Link
        href="/organizations/add"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Organization
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        >
          <option value={10}>Show 10 entries</option>
          <option value={25}>Show 25 entries</option>
          <option value={50}>Show 50 entries</option>
        </select>
      </div>

      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Search organizations..."
        />
      </div>

      <div>
        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">All Domains</option>
          <option value="example.com">example.com</option>
          <option value="test.com">test.com</option>
        </select>
      </div>

      <div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">All Plans</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
        </select>
      </div>
    </div>

    <div className="overflow-x-auto border rounded">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border-b px-4 py-2 text-left">No</th>
            <th
              className="border-b px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('name')}
            >
              Name {getSortIcon('name')}
            </th>
            <th className="border-b px-4 py-2 text-left">Domain</th>
            <th className="border-b px-4 py-2 text-left">Contact Info</th>
            <th className="border-b px-4 py-2 text-left">Plan</th>
            <th className="border-b px-4 py-2 text-left">Created At</th>
            <th className="border-b px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.organizations?.map((org, index) => (
            <tr key={org.id} className="hover:bg-gray-50">
              <td className="border-b px-4 py-2">{(page - 1) * limit + index + 1}</td>
              <td className="border-b px-4 py-2 text-blue-600">{org.name}</td>
              <td className="border-b px-4 py-2">{org.domain}</td>
              <td className="border-b px-4 py-2">
                <div>
                  <p>Email: {org.contactInfo.email}</p>
                  <p>Phone: {org.contactInfo.phone}</p>
                </div>
              </td>
              <td className="border-b px-4 py-2">{org.settings?.billing?.plan}</td>
              <td className="border-b px-4 py-2">{new Date(org.createdAt).toLocaleDateString()}</td>
              <td className="border-b px-4 py-2 flex justify-center gap-2">
                <Link className="text-[#4CAF50] hover:text-gray-600" href={`/organizations/${org.id}/edit`}>
                  <FaEdit size={24} />
                </Link>
                <Link className="text-[#24A0ED] hover:text-gray-600" href={`/organizations/${org.id}`}>
                  <FaEye size={24} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex justify-between items-center mt-4">
      <div>
        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data?.pagination.total || 0)} of {data?.pagination.total || 0} entries
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page * limit >= (data?.pagination.total || 0)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
  )
}

export default OrganizationPage;