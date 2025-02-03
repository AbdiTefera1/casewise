"use client"

import { FaBuilding, FaUsers, FaChartLine, FaRegClock } from 'react-icons/fa';
import { useOrganizations } from '@/hooks/useOrganization';
import { useUsers } from '@/hooks/useUsers';

const SuperAdminDashboard = () => {
  const { data: orgData, isLoading: orgLoading } = useOrganizations();
  const { data: userData, isLoading: userLoading } = useUsers();

  const stats = [
    { 
      title: "Total Organizations",
      value: orgData?.pagination.total || 0,
      icon: <FaBuilding className="w-6 h-6" />,
      change: "+12.5%",
      color: "bg-blue-100 text-blue-600"
    },
    { 
      title: "Total Users",
      value: userData?.total || 0,
      icon: <FaUsers className="w-6 h-6" />,
      change: "+8.3%",
      color: "bg-green-100 text-green-600"
    },
    { 
      title: "Active Plans",
      value: orgData?.organizations.filter(o => o.settings?.billing?.plan === 'premium').length || 0,
      icon: <FaChartLine className="w-6 h-6" />,
      change: "+4.2%",
      color: "bg-purple-100 text-purple-600"
    },
    { 
      title: "Recent Activity",
      value: orgData?.organizations.filter(o => new Date(o.createdAt) > new Date(Date.now() - 7 * 86400000)).length || 0,
      icon: <FaRegClock className="w-6 h-6" />,
      change: "Last 7 days",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  if (orgLoading || userLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-96 rounded-xl bg-gray-100 animate-pulse"></div>
          <div className="h-96 rounded-xl bg-gray-100 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <span className="text-sm text-gray-500">{stat.change}</span>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Organizations */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaBuilding /> Recent Organizations
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Domain</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody>
              {orgData?.organizations.slice(0, 5).map(org => (
                <tr key={org.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{org.name}</td>
                  <td className="py-3 px-4 text-blue-600">{org.domain}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      org.settings?.billing?.plan === 'premium' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {org.settings?.billing?.plan || 'Basic'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUsers /> Recent Users
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody>
              {userData?.users.slice(0, 5).map(user => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4 text-blue-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {/* {new Date(user.).toLocaleDateString()} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;