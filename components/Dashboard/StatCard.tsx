interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-navy-100 rounded-lg">
          {icon}
        </div>
        <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{trend}%
          </span>
        </div>
      </div>
      
      <h3 className="text-gray-500 text-sm font-medium mb-1">
        {title}
      </h3>
      
      <p className="text-2xl font-semibold text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
};

export default StatCard;