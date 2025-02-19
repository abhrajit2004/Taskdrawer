import { create } from 'zustand';

export const useTaskStore = create((set) => ({ 
  tasks : [],
  addTask: (task:any) => set((state:any) => ({ tasks: [...state.tasks, task] })),
  updateTask: (task:any) => set((state:any) => ({ tasks: state.tasks.map((t:any) => t.id === task.id ? task : t) })),
  removeTask: (id:any) => set((state:any) => ({ tasks: state.tasks.filter((t:any) => t.id !== id) })),
}));