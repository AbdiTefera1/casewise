// app/clients/[id]/page.tsx
'use client';

import { use, useState } from 'react';
import { useClient } from '@/hooks/useClients';
import { Client, CompanyType, ClientStatus, Gender } from '@/lib/api/clients';

export default function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('clientDetail');
  const { data, isLoading, error } = useClient(id);

  const client = data?.data?.client; 

  if (isLoading) {
    return (<div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>);
  }

  if (error || !client) {
    return <div className="p-6">Error loading client details</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl text-gray-600 mb-4">
          Client Name : {`${client.firstName} ${client.middleName} ${client.lastName || ''}`}
        </h1>
        
        <div className="border-b">
          <div className="flex gap-4">
            <TabButton 
              active={activeTab === 'clientDetail'} 
              onClick={() => setActiveTab('clientDetail')}
            >
              Client Detail
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
        <button>Delete</button>
      </div>

      {activeTab === 'clientDetail' && (
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <DetailRow 
              label="Full Name" 
              value={`${client.firstName} ${client.middleName} ${client.lastName || ''}`} 
            />
            <DetailRow 
              label="Email" 
              value={client.email || 'N/A'} 
            />
            <DetailRow 
              label="Phone" 
              value={client.contactInfo?.phone || 'N/A'} 
            />
            <DetailRow 
              label="Client Number" 
              value={client.clientNumber || 'N/A'} 
            />
            <DetailRow 
              label="Company Type" 
              value={client.type || 'N/A'} 
            />
            {client.type === CompanyType.COMPANY && (
              <>
                <DetailRow 
                  label="Company Name" 
                  value={client.companyName || 'N/A'} 
                />
                <DetailRow 
                  label="Industry" 
                  value={client.industry || 'N/A'} 
                />
                <DetailRow 
                  label="Website" 
                  value={client.website || 'N/A'} 
                />
              </>
            )}
          </div>
          
          <div className="space-y-4">
            <DetailRow 
              label="Status" 
              value={
                <StatusBadge status={client.status || ClientStatus.ACTIVE} />
              } 
            />
            <DetailRow 
              label="Alternate Email" 
              value={client.contactInfo?.alternateEmail || 'N/A'} 
            />
            <DetailRow 
              label="Address" 
              value={formatAddress(client.contactInfo?.address)} 
            />
            {client.notes && (
              <DetailRow 
                label="Notes" 
                value={client.notes} 
              />
            )}
            <DetailRow 
              label="Created At" 
              value={new Date(client.createdAt).toLocaleDateString()} 
            />
            <DetailRow 
              label="Last Updated" 
              value={new Date(client.updatedAt).toLocaleDateString()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function TabButton({ children, active, onClick }: TabButtonProps) {
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

interface DetailRowProps {
  label: string;
  value: string | React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex gap-4">
      <div className="w-1/3 text-gray-600">{label}</div>
      <div className="w-2/3 text-gray-800">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: ClientStatus }) {
  const statusColors = {
    [ClientStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [ClientStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
    [ClientStatus.SUSPENDED]: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${statusColors[status]}`}>
      {status}
    </span>
  );
}

function formatAddress(address?: Client['contactInfo']['address']): string {
  if (!address) return 'N/A';
  
  const parts = [
    address.street,
    address.city,
    address.state,
    address.country,
    address.postalCode
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : 'N/A';
}