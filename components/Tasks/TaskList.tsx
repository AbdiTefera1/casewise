import { Task } from "@/lib/api/tasks";
import { UserRole } from "@prisma/client";
import {
  Circle,
  CircleCheckBig,
  AlertCircle,
  Clock,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  Flame,
  Timer,
  FileText,
} from "lucide-react";
import { format, isPast, isToday, differenceInDays } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  userRole: UserRole;
}

const TaskList = ({ tasks, userRole }: TaskListProps) => {
  const canManage = ["ADMIN", "LAWYER"].includes(userRole);

  const getPriorityStyle = (priority: Task["priority"]) => {
    switch (priority) {
      case "URGENT":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          ring: "ring-red-200",
          text: "text-red-800",
          icon: <Flame className="h-4 w-4 text-red-600" />,
          label: "URGENT",
        };
      case "HIGH":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          ring: "ring-orange-200",
          text: "text-orange-800",
          icon: <AlertCircle className="h-4 w-4 text-orange-600" />,
          label: "High",
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          ring: "ring-amber-200",
          text: "text-amber-800",
          icon: <Timer className="h-4 w-4 text-amber-600" />,
          label: "Medium",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          ring: "ring-blue-200",
          text: "text-blue-800",
          icon: <Circle className="h-4 w-4 text-blue-600" />,
          label: "Low",
        };
    }
  };

  const getDueDateStatus = (dueDate: string | null) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();

    if (isPast(date) && !isToday(date)) {
      return {
        text: "Overdue",
        color: "text-red-600 bg-red-100",
        icon: <AlertCircle className="h-4 w-4" />,
      };
    }
    if (isToday(date)) {
      return {
        text: "Due Today",
        color: "text-orange-600 bg-orange-100",
        icon: <Clock className="h-4 w-4" />,
      };
    }
    const daysLeft = differenceInDays(date, now);
    if (daysLeft <= 2) {
      return {
        text: `${daysLeft}d left`,
        color: "text-amber-600 bg-amber-100",
        icon: <Timer className="h-4 w-4" />,
      };
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <CircleCheckBig className="h-6 w-6 text-emerald-600" />
          Tasks & Reminders
        </h3>

        {canManage && (
          <button className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00a79d] to-[#5eb8e5] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all">
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
            New Task
          </button>
        )}
      </div>

      {/* Task Items */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CircleCheckBig className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No pending tasks</p>
            <p className="text-sm text-gray-400 mt-1">Enjoy the calm before the storm</p>
          </div>
        ) : (
          tasks.map((task) => {
            const priority = getPriorityStyle(task.priority);
            const dueStatus = getDueDateStatus(task.deadline ? task.deadline.toString() : null);
            const isOverdue = dueStatus?.text === "Overdue";

            return (
              <div
                key={task.id}
                className={`group relative overflow-hidden rounded-2xl border ${priority.border} ${priority.bg} p-5 transition-all hover:shadow-lg hover:-translate-y-1 ${
                  isOverdue ? "ring-2 ring-red-400" : ""
                }`}
              >
                {/* Priority Glow Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${priority.ring} opacity-0 group-hover:opacity-20 transition-opacity absolute`} />

                <div className="relative flex items-start justify-between gap-4">
                  {/* Left: Task Info */}
                  <div className="flex-1 min-w-0">
                    {/* Priority Tag */}
                    <div className="flex items-center gap-2 mb-2">
                      {priority.icon}
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${priority.text} bg-current/10`}>
                        {priority.label}
                      </span>
                      {dueStatus && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${dueStatus.color}`}>
                          {dueStatus.icon}
                          {dueStatus.text}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-semibold text-gray-900 truncate">{task.title}</h4>

                    {/* Case Link + Due Date */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                      {task.case && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          {/* {task.case.caseNumber} */}
                          {task.case.title}
                        </span>
                      )}
                      {task.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(task.deadline), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canManage && (
                      <>
                        <button className="p-2 rounded-lg bg-white/60 hover:bg-white hover:shadow-md transition">
                          <Edit3 className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-2 rounded-lg bg-white/60 hover:bg-red-50 hover:shadow-md transition">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </>
                    )}
                    <button className="p-2 rounded-lg bg-white/60 hover:bg-emerald-50 hover:shadow-md transition">
                      <CircleCheckBig className="h-4 w-4 text-emerald-600" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar (if applicable) */}
                {/* {task.progress && task.progress < 100 && (
                  <div className="mt-4">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-700"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )} */}
              </div>
            );
          })
        )}
      </div>

      {/* Summary Footer */}
      {tasks.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              {tasks.filter((t) => t.status === "COMPLETED").length} completed
            </span>
            <span className="font-semibold text-gray-700">
              {tasks.filter((t) => t.status !== "COMPLETED").length} pending
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;