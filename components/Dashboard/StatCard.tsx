interface StatCardProps {
  title: string;
  subtitle: string;
  count: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, subtitle, count, icon }: StatCardProps) => {

  return (
    <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold text-gray-900">{title}</p>
                <p className="text-3xl font-bold mt-2">{count}</p>
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              </div>
              <div className="text-gray-400">{icon}</div>
            </div>
          </div>
  );
};

export default StatCard;