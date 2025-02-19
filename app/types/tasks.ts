export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  projectId: string;
  completed: boolean;
  createdAt: string;
  projectName: string;
  userId: string;
}

export interface Project {
  projectName : string;
}