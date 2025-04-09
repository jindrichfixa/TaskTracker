export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: "low" | "normal" | "high";
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface NewTask {
  title: string;
  description: string;
  priority: "low" | "normal" | "high";
}
