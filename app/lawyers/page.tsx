'use client';

import React, { useState } from 'react';
import { useLawyers } from '@/hooks/useLawyers';
import Link from 'next/link';
import { FaEdit, FaEye } from 'react-icons/fa';

interface SortConfig {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const LawyersPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortConfig>({
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [specializationFilter, setSpecializationFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, isLoading, error } = useLawyers({
    page,
    limit,
    search,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    specialization: specializationFilter,
    status: statusFilter
  });

  const handleSort = (column: string) => {
    setSort(prev => ({
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (column: string) => {
    if (sort.sortBy !== column) return '↕';
    return sort.sortOrder === 'asc' ? '↑' : '↓';
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (error) return <div className="flex justify-center p-8 text-red-500">Error loading lawyers</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Lawyers</h1>
        <Link 
          href="/lawyers/add" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Lawyer
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
            placeholder="Search lawyers..."
          />
        </div>

        <div>
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Specializations</option>
            <option value="Criminal Law">Criminal Law</option>
            <option value="Family Law">Family Law</option>
            <option value="Corporate Law">Corporate Law</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
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
              <th className="border-b px-4 py-2 text-left">Email</th>
              <th className="border-b px-4 py-2 text-left">Bar Number</th>
              <th className="border-b px-4 py-2 text-left">Specializations</th>
              <th className="border-b px-4 py-2 text-left">Cases</th>
              <th className="border-b px-4 py-2 text-left">Status</th>
              <th className="border-b px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.lawyers?.map((lawyer, index) => (
              <tr key={lawyer.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">{(page - 1) * limit + index + 1}</td>
                <td className="border-b px-4 py-2 text-blue-600">{lawyer.name}</td>
                <td className="border-b px-4 py-2">{lawyer.email}</td>
                <td className="border-b px-4 py-2">{lawyer.lawyer.barNumber}</td>
                <td className="border-b px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {lawyer.lawyer.specializations.map((spec, i) => (
                      <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="border-b px-4 py-2">{lawyer._count?.cases}</td>
                <td className="border-b px-4 py-2">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={lawyer.lawyer.status === 'ACTIVE'}
                      readOnly
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                  {lawyer.lawyer.status}
                </td>
                <td className="border-b px-4 py-2 flex justify-center gap-2">
                  <Link className="text-[#4CAF50] hover:text-gray-600" href={`/lawyers/${lawyer.id}/edit`}>
                    <FaEdit size={24}/>
                  </Link>
                  <Link className="text-[#24A0ED] hover:text-gray-600" href={`/lawyers/${lawyer.id}`}>
                    <FaEye size={24}/>
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
  );
};

export default LawyersPage;
