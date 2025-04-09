import { Card, CardContent } from "@/components/ui/card";

interface TaskStatsProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export default function TaskStats({ 
  totalTasks, 
  completedTasks, 
  pendingTasks
}: TaskStatsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-semibold">{totalTasks}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold text-emerald-600">{completedTasks}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-semibold text-primary">{pendingTasks}</p>
        </CardContent>
      </Card>
    </div>
  );
}
