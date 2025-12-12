import { Case } from '@/lib/api/cases';
import { UserRole } from '@prisma/client';
import {
  Eye,
  Edit,
  Printer,
  Download,
  AlertCircle,
  Calendar,
  FileText,
  ChevronRight,
  Timer,
} from 'lucide-react';
import { format } from 'date-fns';

interface CasesTableProps {
  cases: Case[];
  userRole: UserRole;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'CLOSED':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case 'ARCHIVED':
      return 'bg-slate-100 text-slate-600 border-slate-300';
    case 'URGENT':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const getPriorityIcon = (priority: string) => {
  if (priority === 'URGENT') return <AlertCircle className="h-4 w-4 text-red-600" />;
  if (priority === 'HIGH') return <Timer className="h-4 w-4 text-orange-600" />;
  return null;
};

const CasesTable = ({ cases, userRole }: CasesTableProps) => {
  const canEdit = ['ADMIN', 'LAWYER'].includes(userRole);

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="h-7 w-7 text-[#00a79d]" />
            Active Cases
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {cases.length} case{cases.length !== 1 ? 's' : ''} in progress
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-3">
            <button className="group p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all hover:shadow-md">
              <Printer className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </button>
            <button className="group p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all hover:shadow-md">
              <Download className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-5 px-8 font-medium text-gray-500 text-sm uppercase tracking-wider">
                Case No.
              </th>
              <th className="text-left py-5 px-8 font-medium text-gray-500 text-sm uppercase tracking-wider">
                Title
              </th>
              <th className="text-left py-5 px-8 font-medium text-gray-500 text-sm uppercase tracking-wider">
                Client
              </th>
              <th className="text-left py-5 px-8 font-medium text-gray-500 text-sm uppercase tracking-wider">
                Next Hearing
              </th>
              <th className="text-left py-5 px-8 font-medium text-gray-500 text-sm uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-5 px-8 font-medium text-gray-500 text-sm uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cases.map((case_) => {
              const isUrgent = case_.priority === 'URGENT';
              const hasHearingSoon = case_.endDate && new Date(case_.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

              return (
                <tr
                  key={case_.id}
                  className="group hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/20 hover:to-pink-50/30 transition-all duration-300"
                >
                  {/* Case Number */}
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      {getPriorityIcon(case_.priority)}
                      <span className={`font-bold ${isUrgent ? 'text-red-600' : 'text-gray-900'}`}>
                        {case_.caseNumber}
                      </span>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-6 px-8">
                    <div>
                      <p className="font-semibold text-gray-900">{case_.title}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Opened {format(new Date(case_.startDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </td>

                  {/* Client */}
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00a79d] to-[#5eb8e5] flex items-center justify-center text-white font-bold">
                        {case_.client?.firstName?.[0]}{case_.client?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {case_.client?.firstName} {case_.client?.lastName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Next Hearing */}
                  <td className="py-6 px-8">
                    {case_.endDate ? (
                      <div className={`flex items-center gap-2 ${hasHearingSoon ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                        <Calendar className="h-4 w-4" />
                        {format(new Date(case_.endDate), 'MMM d, yyyy')}
                        {hasHearingSoon && <span className="text-xs bg-red-100 px-2 py-1 rounded-full">Soon</span>}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No date set</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-6 px-8">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold border ${getStatusColor(case_.status)}`}
                    >
                      {case_.status === 'ACTIVE' && 'Active'}
                      {case_.status === 'PENDING' && 'Pending'}
                      {case_.status === 'CLOSED' && 'Closed'}
                      {case_.status === 'ARCHIVED' && 'Archived'}
                      {case_.status === 'URGENT' && 'Urgent'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 text-[#00a79d] hover:shadow-md transition-all group"
                        title="View Case"
                      >
                        <Eye className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </button>

                      {canEdit && (
                        <>
                          <button
                            className="p-2.5 rounded-xl bg-gray-50 hover:bg-amber-50 text-amber-600 hover:shadow-md transition-all group"
                            title="Edit Case"
                          >
                            <Edit className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          </button>
                        </>
                      )}

                      <button className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 hover:shadow-md transition-all group">
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {cases.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No cases found</p>
            <p className="text-gray-400 mt-2">Create your first case to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CasesTable;