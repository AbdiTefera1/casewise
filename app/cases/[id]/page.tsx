'use client';

import { use, useState } from 'react';
import { useCase } from '@/hooks/useCases';

export default function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [activeTab, setActiveTab] = useState<'Detail' | 'History' | 'Transfer'>('Detail');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: caseData, isLoading } = useCase(id);

   // Utility function to safely handle dates
   const safeDate = (dateString: string | Date | undefined | null): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  if (isLoading) return (<div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>);


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl text-gray-700">Case</h1>
        <div className="flex gap-2">
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <DownloadIcon />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <PrintIcon />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex gap-4 px-4">
            {['Detail', 'History', 'Transfer'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'Detail' | 'History' | 'Transfer')}
                className={`py-3 px-4 border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4">
        {activeTab === 'Detail' && (
          <div className="space-y-6">
            {/* Case Detail Section */}
            <section>
              <h2 className="text-lg font-medium mb-4">Case Detail</h2>
              <div className="grid grid-cols-2 gap-4">
                <DetailField 
                  label="Case Type" 
                  value={`${caseData?.case.caseType || 'N/A'} - ${caseData?.case.caseSubType || 'N/A'}`} 
                />
                <DetailField label="First Hearing Date" value={safeDate(caseData?.case.firstHearingDate)} />
                <DetailField label="Filing Number" value={caseData?.case.filingNumber || 'N/A'} />
                <DetailField label="Next Hearing Date" value={safeDate(caseData?.case.nextHearingDate)} />
                <DetailField label="Filing Date" value={safeDate(caseData?.case.filingDate)} />
                <DetailField label="Case Status" value={caseData?.case.status || 'N/A'} />
                <DetailField label="Case Number" value={caseData?.case.caseNumber?.toString() || 'N/A'} />
                <DetailField label="Judge" value={caseData?.case.judge || 'N/A'} />
                <DetailField label="Police Station" value={caseData?.case.policeStation || 'N/A'} />
                <DetailField label="FIR Number" value={caseData?.case.firNumber || 'N/A'} />
                <DetailField label="FIR Date" value={safeDate(caseData?.case.firDate)} />
              </div>
            </section>

            {/* Lawyer Section */}
            <section>
              <h2 className="text-lg font-medium mb-4">Lawyer</h2>
              <div className="space-y-2">
                <DetailField 
                  label="Name" 
                  value={caseData?.case.lawyer?.name || 'N/A'} 
                />
                <DetailField 
                  label="Email" 
                  value={caseData?.case.lawyer?.email || 'N/A'} 
                />
              </div>
            </section>

            {/* Client Section */}
            <section>
              <h2 className="text-lg font-medium mb-4">Client</h2>
              <div className="space-y-2">
                <DetailField 
                  label="Name" 
                  value={`${caseData?.case.client?.firstName || ''} ${caseData?.case.client?.lastName || ''}`.trim() || 'N/A'} 
                />
              </div>
            </section>

            {/* Courts Section */}
            <section>
              <h2 className="text-lg font-medium mb-4">Courts</h2>
              <div className="space-y-2">
                {caseData?.case.courts?.map((court) => (
                  <div key={court.id}>
                    <DetailField label="Court Type" value={court.courtType || 'N/A'} />
                    <DetailField label="Judge Name" value={court.judgeName || 'N/A'} />
                    <DetailField label="Remarks" value={court.remarks || 'N/A'} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

          {activeTab === 'History' && (
            <div>
              <TableControls
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              <table className="w-full mt-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Registration No.</th>
                    <th className="px-4 py-2 text-left">Judge</th>
                    <th className="px-4 py-2 text-left">Business on Date</th>
                    <th className="px-4 py-2 text-left">Hearing Date</th>
                    <th className="px-4 py-2 text-left">Purpose of Hearing</th>
                    <th className="px-4 py-2 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add history rows here */}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Transfer' && (
            <div>
              <TableControls
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              <table className="w-full mt-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">No</th>
                    <th className="px-4 py-2 text-left">Registration No.</th>
                    <th className="px-4 py-2 text-left">Transfer Date</th>
                    <th className="px-4 py-2 text-left">From Court Number and Judge</th>
                    <th className="px-4 py-2 text-left">To Court Number and Judge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No data available in table
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;  // Allow any renderable value
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">
        {value ?? 'N/A'}  {/* Fallback for null/undefined */}
      </dd>
    </div>
  );
}

interface TableControlsProps {
  entriesPerPage: string;
  setEntriesPerPage: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

function TableControls({
  entriesPerPage,
  setEntriesPerPage,
  searchTerm,
  setSearchTerm,
}: TableControlsProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>Show</span>
        <select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(e.target.value)}
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
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
    </svg>
  );
}