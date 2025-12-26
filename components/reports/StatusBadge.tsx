
function StatusBadge({ value }: { value: string }) {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-700',
      INACTIVE: 'bg-gray-100 text-gray-700',
      ARCHIVED: 'bg-red-100 text-red-700',
    };
  
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          colors[value] || 'bg-gray-100'
        }`}
      >
        {value}
      </span>
    );
  }
  

export default StatusBadge