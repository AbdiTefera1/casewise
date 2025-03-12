"use client";

import { useState } from 'react';
import { FaSearch, FaFilter, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaSortAmountDown, FaCalendarAlt, FaUser, FaBalanceScale } from 'react-icons/fa';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentCategory } from '@/lib/api/documents';

const ListDocumentsPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    category: undefined as DocumentCategory | undefined,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  const { data, isLoading } = useDocuments(filters as any);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleCategoryChange = (category: DocumentCategory) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? undefined : category,
      page: 1
    }));
  };

  const handleDateChange = (type: 'start' | 'end', date: Date) => {
    setFilters(prev => ({
      ...prev,
      [type === 'start' ? 'startDate' : 'endDate']: date,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case DocumentCategory.PLEADING: return <FaBalanceScale className="text-blue-500" />;
      case DocumentCategory.EVIDENCE: return <FaFilePdf className="text-red-500" />;
      case DocumentCategory.CORRESPONDENCE: return <FaFileWord className="text-green-500" />;
      case DocumentCategory.CONTRACT: return <FaFileExcel className="text-purple-500" />;
      case DocumentCategory.OTHER: return <FaFileImage className="text-yellow-500" />;
      default: return <FaFilePdf />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Case Documents</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
              value={filters.search}
              onChange={handleSearch}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border rounded-lg w-full appearance-none"
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value as DocumentCategory)}
            >
              <option value="">All Categories</option>
              {Object.values(DocumentCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                onChange={(e) => handleDateChange('start', new Date(e.target.value))}
              />
            </div>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                onChange={(e) => handleDateChange('end', new Date(e.target.value))}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <FaSortAmountDown className="absolute left-3 top-3 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border rounded-lg w-full appearance-none"
            >
              <option>Sort by Date</option>
              <option>Sort by Name</option>
              <option>Sort by Size</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(filters.limit)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : data?.documents.map(document => (
          <div key={document.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
            <div className="flex items-center justify-center bg-gray-100 rounded-lg h-40 mb-4 p-4">
              <div className="text-center">
                {getCategoryIcon(document.category as DocumentCategory)}
                <p className="mt-2 text-sm text-gray-600">{document.category}</p>
              </div>
            </div>
            
            <h3 className="font-semibold truncate">{document.title}</h3>
            <p className="text-sm text-gray-500 truncate">{document.description}</p>
            
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaUser className="text-gray-400" />
                <span>{document.uploadedBy.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBalanceScale className="text-gray-400" />
                <span>{document.case.caseNumber}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <a
                href={document.storageUrl}
                download
                className="text-blue-600 hover:text-blue-800"
              >
                Download
              </a>
              <span className="text-sm text-gray-500">
                {formatFileSize(document.fileSize)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: data.pagination.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  filters.page === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDocumentsPage;