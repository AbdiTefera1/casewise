'use client';

import { use, useState } from 'react';
import { useLawyer } from '@/hooks/useLawyers';

type LawyerStatus = 'ACTIVE' | 'INACTIVE';
type LicenseStatus = 'Active' | 'Inactive';

export default function LawyerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'profile' | 'cases' | 'account'>(
    'profile'
  );

  const { data, isLoading, error } = useLawyer(id);
//   console.log("Here the data throught Hook: ", data)

  const lawyer = data?.lawyer;
  const details = lawyer?.lawyer;
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error || !lawyer || !details) {
    return <div className="p-6">Error loading lawyer details</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl text-gray-600 mb-4">
          Lawyer Name : {lawyer.name}
        </h1>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-4">
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </TabButton>
            <TabButton
              active={activeTab === 'cases'}
              onClick={() => setActiveTab('cases')}
            >
              Cases
            </TabButton>
            <TabButton
              active={activeTab === 'account'}
              onClick={() => setActiveTab('account')}
            >
              Account
            </TabButton>
          </div>
        </div>

        <button className="mt-4 text-red-600 hover:underline">
          Delete
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-4">
            <DetailRow label="Full Name" value={lawyer.name} />
            <DetailRow label="Email" value={lawyer.email} />
            <DetailRow label="Bar Number" value={details.barNumber ?? 'N/A'} />

            <DetailRow
              label="Specializations"
              value={
                details.specializations?.length
                  ? details.specializations.join(', ')
                  : 'N/A'
              }
            />

            <DetailRow
              label="Hourly Rate"
              value={
                details.hourlyRate !== undefined
                  ? `$${details.hourlyRate}/hr`
                  : 'N/A'
              }
            />

            <DetailRow
              label="License Status"
              value={
                details.licenseStatus ? (
                  <LicenseBadge status={details.licenseStatus} />
                ) : (
                  'N/A'
                )
              }
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <DetailRow
              label="Status"
              value={<StatusBadge status={details.status} />}
            />

            <DetailRow
              label="Jurisdictions"
              value={formatJurisdictions(details.jurisdictions)}
            />

            <DetailRow
              label="Phone"
              value={details.contactInfo?.phone ?? 'N/A'}
            />

            <DetailRow
              label="Address"
              value={formatAddress(details.contactInfo?.address)}
            />

            <DetailRow
              label="Availability"
              value={formatAvailability(details.availability)}
            />

            <DetailRow
              label="Assigned Cases"
              value={lawyer._count?.cases ?? 0}
            />
          </div>
        </div>
      )}

      {/* Cases Tab */}
      {activeTab === 'cases' && (
  <div className="mt-6">
    {lawyer.cases?.length ? (
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Case #</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Next Hearing</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {lawyer.cases.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  {c.caseNumber}
                </td>

                <td className="px-4 py-3">
                  {c.title}
                </td>

                <td className="px-4 py-3">
                  {c.client?.firstName ?? 'N/A'}
                </td>

                <td className="px-4 py-3">
                  {c.caseType}
                </td>

                <td className="px-4 py-3">
                  <CaseStatusBadge status={c.status} />
                </td>

                <td className="px-4 py-3">
                  <PriorityBadge priority={c.priority} />
                </td>

                <td className="px-4 py-3">
                  {c.nextHearingDate
                    ? new Date(c.nextHearingDate).toLocaleDateString()
                    : '—'}
                </td>

                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-gray-500 text-center py-10">
        No cases assigned to this lawyer
      </div>
    )}
  </div>
)}


      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="space-y-4">
          <DetailRow
            label="Created At"
            value={new Date(lawyer.createdAt).toLocaleDateString()}
          />
          <DetailRow
            label="Last Updated"
            value={new Date(lawyer.updatedAt).toLocaleDateString()}
          />
        </div>
      )}
    </div>
  );
}

/* ---------------- UI Components ---------------- */

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium ${
        active
          ? 'border-b-2 border-blue-500 text-blue-500'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-1/3 text-gray-600">{label}</div>
      <div className="w-2/3 text-gray-800">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: LawyerStatus }) {
  const colors = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colors[status]}`}>
      {status}
    </span>
  );
}

function LicenseBadge({ status }: { status: LicenseStatus }) {
  const colors = {
    Active: 'bg-blue-100 text-blue-800',
    Inactive: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colors[status]}`}>
      {status}
    </span>
  );
}

/* ---------------- Helpers (SAFE) ---------------- */

function formatAddress(address?: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}) {
  if (!address) return 'N/A';

  return (
    [address.street, address.city, address.state, address.zipCode]
      .filter(Boolean)
      .join(', ') || 'N/A'
  );
}

function formatJurisdictions(j?: {
  regions?: string[];
  countries?: string[];
}) {
  if (!j) return 'N/A';

  return (
    [...(j.regions ?? []), ...(j.countries ?? [])].join(', ') || 'N/A'
  );
}

function formatAvailability(a?: {
  daysAvailable?: string[];
  hoursAvailable?: { from: string; to: string };
}) {
  if (!a) return 'N/A';

  return `${a.daysAvailable?.join(', ') ?? 'N/A'} | ${
    a.hoursAvailable
      ? `${a.hoursAvailable.from} - ${a.hoursAvailable.to}`
      : 'N/A'
  }`;
}

function CaseStatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
    };
  
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[status] ?? 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  }

  
  function PriorityBadge({ priority }: { priority: string }) {
    const colors: Record<string, string> = {
      HIGH: 'bg-red-100 text-red-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-green-100 text-green-800',
    };
  
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[priority] ?? 'bg-gray-100 text-gray-800'
        }`}
      >
        {priority}
      </span>
    );
  }
  
