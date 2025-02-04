'use client';

import { useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { format } from 'date-fns';
import { FiMoreHorizontal, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { AppointmentStatus, AppointmentType } from '@/lib/api/appointments';

interface DateRangeFilter {
  fromDate: string;
  toDate: string;
}

export default function AppointmentsPage() {
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    fromDate: '',
    toDate: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus>();
  const [typeFilter, setTypeFilter] = useState<AppointmentType>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: appointmentsData,
    isLoading,
  } = useAppointments({
    page,
    limit,
    startDate: dateRange.fromDate ? new Date(dateRange.fromDate) : undefined,
    endDate: dateRange.toDate ? new Date(dateRange.toDate) : undefined,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  });

  const handleSearch = () => {
    // Reset to the first page when searching
    setPage(1);
  };

  const handleClear = () => {
    setDateRange({ fromDate: '', toDate: '' });
    setSearchTerm('');
    setStatusFilter(AppointmentStatus.SCHEDULED);
    setTypeFilter(AppointmentType.IN_PERSON);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Appointments</h1>
        <Link
        href="/appointments/add"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiPlus /> Add Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-lg shadow mb-6">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">From Date:</label>
              <input
                type="date"
                value={dateRange.fromDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, fromDate: e.target.value }))}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">To Date:</label>
              <input
                type="date"
                value={dateRange.toDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, toDate: e.target.value }))}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">All</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="RESCHEDULED">RESCHEDULED</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">All</option>
                <option value="IN_PERSON">IN_PERSON</option>
                <option value="VIRTUAL">VIRTUAL</option>
              </select>
            </div>
            {/* <div>
              <label className="block text-sm mb-1">Organization ID:</label>
              <input
                type="text"
                value={organizationIdFilter}
                onChange={(e) => setOrganizationIdFilter(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div> */}
            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <FiSearch className="inline-block mr-1" /> Search
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <FiX className="inline-block mr-1" /> Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Controls */}
      <div className="rounded-lg shadow">
        <div className="p-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-1"
            />
          </div>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto border rounded">
          <table className="w-full border-collapse">
            <thead className="">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">No</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Lawyer</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Case</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Start Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium">End Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={13} className="text-center py-4">Loading...</td>
                </tr>
              ) : (
                appointmentsData?.appointments.map((appointment, index) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>
                    <td className="px-4 py-3">{appointment.title}</td>
                    <td className="px-4 py-3">{appointment.client.firstName}</td>
                    <td className="px-4 py-3">{appointment.lawyer.name}</td>
                    <td className="px-4 py-3">{appointment.case?.caseNumber || 'N/A'}</td>
                    <td className="px-4 py-3">{format(new Date(appointment.appointmentDate), 'dd-MM-yyyy')}</td>
                    <td className="px-4 py-3">{format(new Date(appointment.startTime), 'HH:mm')}</td>
                    <td className="px-4 py-3">{format(new Date(appointment.endTime), 'HH:mm')}</td>
                    <td className="px-4 py-3">
                      <select
                        className="border rounded px-2 py-1"
                        value={appointment.status}
                        onChange={() => {/* Handle status change */}}
                      >
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="RESCHEDULED">RESCHEDULED</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiMoreHorizontal />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center border-t">
          <span>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, appointmentsData?.total || 0)} of{' '}
            {appointmentsData?.total} entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= (appointmentsData?.page || 1)}
              className="px-4 py-2 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}