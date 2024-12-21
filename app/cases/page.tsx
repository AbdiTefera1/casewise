// app/cases/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { useCases } from '@/hooks/useCases';
import { CaseStatus, CasePriority, Case } from '@/lib/api/cases';
import Link from 'next/link';

type TabType = 'ALL' | 'IMPORTANT' | 'ARCHIVED';

const CasesPage = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus] = useState<CaseStatus | undefined>();
  const [selectedPriority] = useState<CasePriority | undefined>();

  const isImportantCase = (status: CaseStatus, priority: CasePriority) => {
    return (
      (status === 'ACTIVE' || status === 'INACTIVE') &&
      (priority === 'URGENT' || priority === 'HIGH')
    );
  };

  // Modified to handle single status/priority
  const getQueryParams = () => {
    const baseParams = {
      page,
      limit,
      search: searchTerm,
      sortBy,
      sortOrder,
      startDate: fromDate || undefined,
      endDate: toDate || undefined,
    };

    switch (activeTab) {
      case 'IMPORTANT':
        // We'll need to handle important cases filtering on the frontend
        return {
          ...baseParams,
          status: 'ACTIVE' as CaseStatus, // Start with ACTIVE cases
        };
      case 'ARCHIVED':
        return {
          ...baseParams,
          status: 'ARCHIVED' as CaseStatus,
        };
      default:
        return {
          ...baseParams,
          status: selectedStatus,
          priority: selectedPriority,
        };
    }
  };

  const { data, isLoading } = useCases(getQueryParams());
  // console.log(data)

  const { cases = [], pagination } = data || { cases: [], pagination: { total: 0, pages: 0 } };
  console.log(cases)
  // Filter important cases on the frontend when needed
  const filteredCases = useMemo(() => {
    if (!cases) return [];

    if (activeTab === 'IMPORTANT') {
      return cases.filter(caseItem =>
        isImportantCase(caseItem.status, caseItem.priority)
      );
    }

    return cases;
  }, [cases, activeTab]);

  // const { cases = [], pagination } = data || { cases: [], pagination: { total: 0, pages: 0 } };
  

  if (isLoading) return (<div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>);

  const handleSearch = () => {
    setPage(1);
  };

  const handleClear = () => {
    setFromDate(null);
    setToDate(null);
    setSearchTerm('');
    setPage(1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  

  const getPriorityBadgeColor = (priority: CasePriority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: CaseStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800';
      case 'INACTIVE':
        return 'bg-purple-100 text-purple-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-gray-700">Cases</h1>
        <Link href='/cases/add' className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          + Add Case
        </Link>
      </div>

      {/* Date Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">From Date:</label>
            <input
              type="date"
              value={fromDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => setFromDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To Date:</label>
            <input
              type="date"
              value={toDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => setToDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Clear
            </button>
            <button
              onClick={handleSearch}
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex">
            {(['ALL', 'IMPORTANT', 'ARCHIVED'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 border-b-2 ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500'
                  }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()} Cases
              </button>
            ))}
          </nav>
        </div>

        {/* Table Controls */}

        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Search:</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-1"
            />
          </div>
        </div>

        {/* Cases Table */}
        <div className="overflow-x-auto border rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm text-gray-500 cursor-pointer"
                  onClick={() => handleSort('id')}>No</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-500 cursor-pointer"
                  onClick={() => handleSort('id')}>Filing Number</th>
                <th className="px-4 py-2 text-left text-sm text-gray-500 cursor-pointer"
                  onClick={() => handleSort('title')}>Client & Case Detail</th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">Court Detail</th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">Petitioner vs Respondent</th>
                <th className="px-4 py-2 text-left text-sm text-gray-500 cursor-pointer"
                  onClick={() => handleSort('nextDate')}>Next Date</th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">Status</th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">Priority</th>
                <th className="px-4 py-2 text-left text-sm text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">Loading...</td>
                </tr>
              ) : filteredCases.map((caseItem, idx) => (
                <tr key={caseItem.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{caseItem.filingNumber}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {isImportantCase(caseItem.status, caseItem.priority) && (
                        <span className="text-yellow-500">★</span>
                      )}
                      <div>
                        <div className="font-medium">Case: {caseItem.title}</div>
                        <div className="text-sm text-gray-500">
                          Client: {caseItem.client?.firstName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <ul>{caseItem.courts.map(item => (<li key={item.id}>{item.court}</li>))}</ul>
                  </td>
                  <td className="px-4 py-2">
                    {caseItem.lawyer.name}
                  </td>
                  <td className="px-4 py-2">
                    {caseItem.endDate && new Date(caseItem.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getPriorityBadgeColor(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} entries
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">
              Previous
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)} className={`px-3 py-1 border rounded ${page === i + 1 ? 'bg-blue-500 text-white' : ''}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(page + 1)} disabled={page === pagination.pages} className="px-3 py-1 border rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CasesPage;

