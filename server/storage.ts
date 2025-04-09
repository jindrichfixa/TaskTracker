import { users, type User, type InsertUser } from "@shared/schema";
import { tasks, type Task, type InsertTask, type UpdateTask } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

// Storage interface
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task-related methods
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<UpdateTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasksMap: Map<number, Task>;
  private userCurrentId: number;
  private taskCurrentId: number;

  constructor() {
    this.users = new Map();
    this.tasksMap = new Map();
    this.userCurrentId = 1;
    this.taskCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasksMap.values()).sort((a, b) => {
      // Sort by completion status first (pending tasks first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then sort by priority (high priority first)
      if (a.priority !== b.priority) {
        return a.priority === 'high' ? -1 : 1;
      }
      // Finally sort by creation date (newer first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasksMap.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskCurrentId++;
    const now = new Date();
    
    const task: Task = {
      id,
      title: insertTask.title,
      description: insertTask.description || null,
      priority: insertTask.priority as "low" | "normal" | "high" || "normal",
      completed: false,
      createdAt: now,
      completedAt: null,
    };
    
    this.tasksMap.set(id, task);
    return task;
  }

  async updateTask(id: number, updateData: Partial<UpdateTask>): Promise<Task | undefined> {
    const task = this.tasksMap.get(id);
    
    if (!task) {
      return undefined;
    }
    
    // Handle completion status change
    if (updateData.completed !== undefined && updateData.completed !== task.completed) {
      task.completed = updateData.completed;
      
      // Update completedAt timestamp based on completion status
      if (updateData.completed) {
        task.completedAt = new Date();
      } else {
        task.completedAt = null;
      }
    }
    
    this.tasksMap.set(id, task);
    return task;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasksMap.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllTasks(): Promise<Task[]> {
    // Get all tasks
    const allTasks = await db
      .select()
      .from(tasks);
    
    // Manually sort them in JavaScript
    return allTasks.sort((a, b) => {
      // Sort by completion status first (pending tasks first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // For completed tasks, sort by completion date (most recent first)
      if (a.completed && b.completed && a.completedAt && b.completedAt) {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
      
      // For pending tasks, sort by priority (high first, low last)
      if (a.priority !== b.priority) {
        if (a.priority === 'high') return -1;
        if (a.priority === 'low') return 1;
        return b.priority === 'high' ? 1 : -1;
      }
      
      // If same priority, sort by creation date (newer first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        ...insertTask,
        completed: false,
        createdAt: new Date(),
        completedAt: null
      })
      .returning();
    return task;
  }

  async updateTask(id: number, updateData: Partial<UpdateTask>): Promise<Task | undefined> {
    // First check if task exists
    const existingTask = await this.getTask(id);
    if (!existingTask) {
      return undefined;
    }

    // Prepare update values
    const updateValues: any = { ...updateData };

    // Set completedAt timestamp if completing the task
    if (updateData.completed !== undefined) {
      if (updateData.completed && (!existingTask.completedAt || !existingTask.completed)) {
        updateValues.completedAt = new Date();
      } else if (!updateData.completed) {
        updateValues.completedAt = null;
      }
    }

    // Update the task
    const [updatedTask] = await db
      .update(tasks)
      .set(updateValues)
      .where(eq(tasks.id, id))
      .returning();

    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });
    
    return result.length > 0;
  }
}

// Use DatabaseStorage for persistent storage
export const storage = new DatabaseStorage();
