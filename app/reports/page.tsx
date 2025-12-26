'use client';

import MetricCard from '@/components/reports/MetricCard';
import StatusBadge from '@/components/reports/StatusBadge';
import {
  useGeneralMetrics,
  useCaseStatusReport,
  useFinancialReport,
  useLawyerPerformance,
} from '@/hooks/useReports';

export default function ReportsPage() {
  const { data: general, isLoading: loadingGeneral } = useGeneralMetrics();
  const { data: caseStatus, isLoading: loadingCaseStatus } = useCaseStatusReport();
  const { data: financial, isLoading: loadingFinancial } = useFinancialReport({});
  const { data: lawyerPerformance, isLoading: loadingLawyers } = useLawyerPerformance();

  console.log("General Report: ", general)
  if (loadingGeneral || loadingCaseStatus || loadingFinancial || loadingLawyers) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-gray-800" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold">Reports & Analytics</h1>

      {/* KPI CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Cases" value={general?.totalCases} />
        <MetricCard title="Clients" value={general?.totalClients} />
        <MetricCard title="Lawyers" value={general?.totalLawyers} />
        <MetricCard title="Documents" value={general?.totalDocuments} />
      </section>

      {/* CASE STATUS */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-medium mb-4">Case Status Distribution</h2>
        <div className="flex gap-6">
          {caseStatus?.statusDistribution?.map((item) => (
            <div
              key={item.status}
              className="px-4 py-2 rounded bg-gray-100 text-sm"
            >
              <p className="font-medium">{item.status}</p>
              <p className="text-gray-600">{item._count} cases</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT CASES */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-medium mb-4">Recent Cases</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Case No</th>
                <th className="p-2 text-left">Title</th>
                <th className="p-2">Client</th>
                <th className="p-2">Lawyer</th>
                <th className="p-2">Status</th>
                <th className="p-2">Priority</th>
              </tr>
            </thead>
            <tbody>
              {caseStatus?.recentCases?.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.caseNumber}</td>
                  <td className="p-2">{c.title}</td>
                  <td className="p-2">{c.client?.firstName}</td>
                  <td className="p-2">{c.lawyer?.name}</td>
                  <td className="p-2">
                    <StatusBadge value={c.status} />
                  </td>
                  <td className="p-2">{c.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FINANCIAL REPORT */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-medium mb-4">Financial Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total Payments"
            value={financial?.paymentSummary?._count ?? 0}
          />
          <MetricCard
            title="Total Amount"
            value={financial?.paymentSummary?._sum?.amount ?? 0}
          />
          <MetricCard
            title="Outstanding Balance"
            value={financial?.outstandingBalance?._sum?.total ?? 0}
          />
        </div>
      </section>

      {/* LAWYER PERFORMANCE */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-medium mb-4">Lawyer Performance</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Lawyer</th>
              <th className="p-2">Total Cases</th>
              <th className="p-2">Completed Cases</th>
              <th className="p-2">Tasks</th>
              <th className="p-2">Completed Tasks</th>
            </tr>
          </thead>
          <tbody>
            {lawyerPerformance?.performanceData?.map((lawyer) => (
              <tr key={lawyer.id} className="border-t">
                <td className="p-2">{lawyer.name}</td>
                <td className="p-2 text-center">{lawyer.totalCases}</td>
                <td className="p-2 text-center">{lawyer.completedCases}</td>
                <td className="p-2 text-center">{lawyer.totalTasks}</td>
                <td className="p-2 text-center">{lawyer.completedTasks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
