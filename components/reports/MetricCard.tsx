
function MetricCard({ title, value }: { title: string; value: number }) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value ?? 0}</p>
      </div>
    );
  }
  

export default MetricCard