export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string | null;  // ISO datetime string, null means no deadline
  completed: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Omit<Task, 'id' | 'createdAt'>> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'LOAD_TASKS'; payload: Task[] };
