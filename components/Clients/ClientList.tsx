"use client";

import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import Link from 'next/link';
import { CompanyType, ClientStatus, Client } from '@/lib/api/clients'; 

interface SortConfig {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const ClientList = () => {
  // State management
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortConfig>({
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [statusFilter, setStatusFilter] = useState<ClientStatus | undefined>();
  const [typeFilter, setTypeFilter] = useState<CompanyType | undefined>();
  const [industryFilter, setIndustryFilter] = useState<string>('');

  // Fetch clients using the hook
  const { data, isLoading, error } = useClients({
    page,
    limit,
    search,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    type: typeFilter,
    status: statusFilter,
    industry: industryFilter
  });

  // Handle sort
  const handleSort = (column: string) => {
    setSort(prev => ({
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (sort.sortBy !== column) return '↕';
    return sort.sortOrder === 'asc' ? '↑' : '↓';
  };

  if (isLoading) return (<div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>);
  if (error) return <div className="flex justify-center p-8 text-red-500">Error loading clients</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <Link 
          href="/clients/add" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Client
        </Link>
      </div>

      {/* Filters */}
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
            placeholder="Search clients..."
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ClientStatus)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Status</option>
            {Object.values(ClientStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as CompanyType)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Types</option>
            {Object.values(CompanyType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Industries</option>
            {/* Add your industry options here */}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b px-4 py-2 text-left">No</th>
              <th 
                className="border-b px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                Client Name {getSortIcon('name')}
              </th>
              <th 
                className="border-b px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('email')}
              >
                Email {getSortIcon('email')}
              </th>
              <th 
                className="border-b px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('clientNumber')}
              >
                Client Number {getSortIcon('clientNumber')}
              </th>
              <th 
                className="border-b px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                Status {getSortIcon('status')}
              </th>
              <th className="border-b px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.clients?.map((client: Client, index: number) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">{(page - 1) * limit + index + 1}</td>
                <td className="border-b px-4 py-2 text-blue-600">{client.name}</td>
                <td className="border-b px-4 py-2">{client.email || '-'}</td> {/* Display '-' if email is not provided */}
                <td className="border-b px-4 py-2">{client.clientNumber}</td>
                {/* Displaying status using ClientStatus enum */}
                <td className="border-b px-4 py-2">
                  {/* Checkbox for status */}
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    {/* Display checkbox based on status */}
                    <input
                      type="checkbox"
                      checked={client.status === ClientStatus.ACTIVE} // Check if status is ACTIVE
                      readOnly // Make it read-only as it seems to be a display field
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    {/* You can add a label for better accessibility */}
                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                  {/* Displaying the current status as text */}
                  {client.status || '-'} {/* Display '-' if status is not provided */}
                </td>
                <td className="border-b px-4 py-2">
                  {/* Action button */}
                  <button className="text-gray-400 hover:text-gray-600">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data?.data.pagination.total || 0)} of {data?.data.pagination.total || 0} entries
        </div>
        <div className="flex gap-2">
          {/* Previous Page Button */}
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          {/* Next Page Button */}
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * limit >= (data?.data.pagination.total || 0)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientList;
