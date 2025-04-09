import { Task } from "../types/task";
import { Check, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  // Format dates for display with 24-hour time (HH:MM) and date format (dd-MM-yyyy)
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd-MM-yyyy \'at\' HH:mm');
    } catch (e) {
      return "Invalid date";
    }
  };

  const createdAtFormatted = formatDate(task.createdAt);
  const completedAtFormatted = task.completedAt ? formatDate(task.completedAt) : null;

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm p-4 task-item ${
        task.completed 
          ? 'bg-gray-50 opacity-75 border-l-4 border-secondary task-item-completed' 
          : `border-l-4 ${
              task.priority === 'high' 
                ? 'border-yellow-500 task-item-high' 
                : task.priority === 'low' 
                  ? 'border-blue-500 task-item-low' 
                  : 'border-primary task-item-normal'
            }`
      } transition-all duration-300`}
      data-task-id={task.id}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            {task.completed ? (
              <button 
                className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center"
                onClick={onToggleComplete}
                aria-label="Mark as incomplete"
              >
                <Check className="h-4 w-4" />
              </button>
            ) : (
              <button 
                className="mr-3 flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={onToggleComplete}
                aria-label="Mark as complete"
              ></button>
            )}
            <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </span>
            {!task.completed && (
              <>
                {task.priority === 'low' && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Low
                  </span>
                )}
                {task.priority === 'high' && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    High
                  </span>
                )}
              </>
            )}
          </div>
          
          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-xs text-gray-500">
            <div className="flex items-center mb-1 sm:mb-0 sm:mr-4">
              <svg className="text-gray-400 w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Added on {createdAtFormatted}</span>
            </div>
            
            {task.completed && completedAtFormatted && (
              <div className="flex items-center">
                <svg className="text-secondary w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Completed on {completedAtFormatted}</span>
              </div>
            )}
          </div>
        </div>
        
        <button 
          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
          onClick={onDelete}
          aria-label="Delete task"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
