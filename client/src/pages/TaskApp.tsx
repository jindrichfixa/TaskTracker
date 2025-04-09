import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { CheckCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { Task } from "../types/task";
import TaskItem from "@/components/TaskItem";
import TaskAdd from "@/components/TaskAdd";
import TaskDelete from "@/components/TaskDelete";
import TaskStats from "@/components/TaskStats";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function TaskApp() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch all tasks
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Add task mutation
  const createTaskMutation = useMutation({
    mutationFn: (newTask: { title: string; description: string; priority: string }) => {
      return apiRequest("POST", "/api/tasks", newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setAddModalOpen(false);
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => {
      return apiRequest("PATCH", `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setDeleteModalOpen(false);
      setTaskToDelete(null);
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle task completion toggle
  const handleTaskComplete = (task: Task) => {
    toggleTaskMutation.mutate({
      id: task.id,
      completed: !task.completed,
    });
  };

  // Handle task deletion
  const handleTaskDelete = (taskId: number) => {
    setTaskToDelete(taskId);
    setDeleteModalOpen(true);
  };

  // Confirm task deletion
  const confirmTaskDelete = () => {
    if (taskToDelete !== null) {
      deleteTaskMutation.mutate(taskToDelete);
    }
  };

  // Filter tasks by completion status
  const pendingTasks = tasks.filter(task => !task.completed);
  
  // Sort completed tasks by completedAt date (most recent first)
  const completedTasks = tasks
    .filter(task => task.completed)
    .sort((a, b) => {
      // Both tasks have completedAt dates
      if (a.completedAt && b.completedAt) {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
      // Handle cases where completedAt might be null (should not happen for completed tasks)
      return a.completedAt ? -1 : b.completedAt ? 1 : 0;
    });

  // Compute stats
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      {/* Header */}
      <header className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">J. WIP</h1>
            <p className="text-gray-500">
              {pendingTasks.length} tasks pending • {completedTasks.length} completed
            </p>
          </div>
          <div className="flex space-x-2">
            {/* Theme Switcher */}
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto">
        {/* Task statistics */}
        <TaskStats 
          totalTasks={totalTasks} 
          completedTasks={completedTasks.length} 
          pendingTasks={pendingTasks.length}
        />
        
        {/* Task Lists */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Pending Tasks</h2>
          
          {/* Task List Container for Pending Tasks */}
          <div className="space-y-3" id="pending-tasks">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-4 text-gray-500 italic">No tasks</div>
            ) : (
              pendingTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={() => handleTaskComplete(task)}
                  onDelete={() => handleTaskDelete(task.id)}
                />
              ))
            )}
            
            {/* Add New Task Button at Bottom of Pending Tasks */}
            <div className="pt-2">
              <button 
                className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 text-gray-500 hover:text-primary flex items-center justify-center transition-colors duration-200"
                onClick={() => setAddModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add new task
              </button>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Completed Tasks</h2>
          
          {/* Task List Container for Completed Tasks */}
          <div className="space-y-3" id="completed-tasks">
            {completedTasks.length === 0 ? (
              <div className="text-center py-4 text-gray-500 italic">No tasks</div>
            ) : (
              completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={() => handleTaskComplete(task)}
                  onDelete={() => handleTaskDelete(task.id)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Empty State (shown when no tasks exist) */}
      {totalTasks === 0 && !isLoading && (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first task using the button below.</p>
          <button 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add your first task
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-6">
        <button 
          className="w-14 h-14 rounded-full bg-primary hover:bg-blue-600 text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={() => setAddModalOpen(true)}
          aria-label="Add new task"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Add Task Modal */}
      <TaskAdd 
        isOpen={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onSubmit={(data) => createTaskMutation.mutate(data)}
        isPending={createTaskMutation.isPending}
      />
      
      {/* Delete Confirmation Modal */}
      <TaskDelete 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        onConfirm={confirmTaskDelete}
        isPending={deleteTaskMutation.isPending}
      />
    </div>
  );
}
