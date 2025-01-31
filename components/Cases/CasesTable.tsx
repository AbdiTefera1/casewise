import { Case } from '@/lib/api/cases';
import { UserRole } from '@prisma/client';
import { FiEye, FiEdit, FiPrinter, FiDownload } from 'react-icons/fi';

interface CasesTableProps {
  cases: Case[];
  userRole: UserRole;
}

const CasesTable = ({ cases, userRole }: CasesTableProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Cases board</h2>
      {['ADMIN', 'LAWYER'].includes(userRole) && (
        <div className="flex gap-2">
        <button className="p-2 text-gray-600 hover:text-gray-800">
          <FiPrinter className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-600 hover:text-gray-800">
          <FiDownload className="w-5 h-5" />
        </button>
      </div>
      )}
    </div>
    <table className="w-full">
      <thead>
        <tr className="text-left text-gray-500">
          <th className="py-3">No.</th>
          <th>Case</th>
          <th>Client</th>
          <th>End dates</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((case_) => (
          <tr key={case_.id} className="border-t">
            <td className="py-3">{case_.caseNumber}</td>
            <td>{case_.title}</td>
            <td>{case_.client?.firstName}</td>
            <td>{case_.endDate ? (new Date(case_.endDate).getDate() + "-" + new Date(case_.endDate).getMonth() + "-" + new Date(case_.endDate).getFullYear()) : 'N/A'}</td>
            <td>{case_.status}</td>
            <td>
              <div className="flex gap-2">
                <button className="text-green-500">
                  <i className="fas fa-eye"></i>
                </button>
                {['ADMIN', 'LAWYER'].includes(userRole) && (
                  <div className="flex gap-2">
                  <button className="text-green-600 hover:text-green-800">
                    <FiEye className="w-5 h-5" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiEdit className="w-5 h-5" />
                  </button>
                </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CasesTable;