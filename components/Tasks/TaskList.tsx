import { Task } from "@/lib/api/tasks";
import { UserRole } from "@prisma/client";



interface TaskListProps {
  tasks: Task[];
  userRole: UserRole;
}

const TaskList = ({ tasks, userRole }: TaskListProps) => {
  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      URGENT: 'bg-red-100',
      HIGH: 'bg-orange-100',
      MEDIUM: 'bg-yellow-100',
      LOW: 'bg-blue-100',
    };
    return colors[priority];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Task List</h2>
        {['ADMIN', 'LAWYER'].includes(userRole) && (
          <button className="text-blue-500 hover:text-blue-700">
            <i className="fas fa-plus"></i> Add Task
          </button>
        )}
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded ${getPriorityColor(task.priority)}`}
          >
            <div className="flex justify-between items-center">
              <p className="font-medium">{task.title}</p>
              {['admin', 'lawyer'].includes(userRole) && (
                <div className="flex gap-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;