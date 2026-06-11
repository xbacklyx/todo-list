import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { nanoid } from 'nanoid';
import type { Task, FilterType, TaskAction } from '../types';

const STORAGE_KEY = 'todo-list-tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'ADD_TASK':
      return [action.payload, ...state];

    case 'UPDATE_TASK': {
      const { id, updates } = action.payload;
      return state.map(t => (t.id === id ? { ...t, ...updates } : t));
    }

    case 'DELETE_TASK':
      return state.filter(t => t.id !== action.payload);

    case 'TOGGLE_TASK':
      return state.map(t =>
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      );

    case 'LOAD_TASKS':
      return action.payload;

    default:
      return state;
  }
}

interface TaskContextValue {
  tasks: Task[];
  addTask: (title: string, priority: Task['priority'], dueDate: string | null) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  getFilteredTasks: (filter: FilterType) => Task[];
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, [], loadTasks);

  // Persist to localStorage on every change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function addTask(title: string, priority: Task['priority'], dueDate: string | null) {
    const task: Task = {
      id: nanoid(),
      title: title.trim(),
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TASK', payload: task });
  }

  function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  }

  function deleteTask(id: string) {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }

  function toggleTask(id: string) {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  }

  function getFilteredTasks(filter: FilterType): Task[] {
    // Sort: high priority first, then medium, then low.
    // Within same priority, sort by due date (null goes last), then by creation date.
    const sorted = [...tasks].sort((a, b) => {
      const pOrder = { high: 0, medium: 1, low: 2 };
      const pDiff = pOrder[a.priority] - pOrder[b.priority];
      if (pDiff !== 0) return pDiff;

      // Sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      // Fallback: newer first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    switch (filter) {
      case 'active':
        return sorted.filter(t => !t.completed);
      case 'completed':
        return sorted.filter(t => t.completed);
      default:
        return sorted;
    }
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTask, getFilteredTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
