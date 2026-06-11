import { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import { useTasks } from './context/TaskContext';
import { useNotification } from './hooks/useNotification';
import Header from './components/Header';
import AddTaskForm from './components/AddTaskForm';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import type { FilterType } from './types';
import './App.css';

function TodoApp() {
  const { tasks } = useTasks();
  const [filter, setFilter] = useState<FilterType>('all');

  // Setup notification checker
  useNotification(tasks);

  return (
    <div className="app">
      <Header />
      <main className="main">
        <AddTaskForm />
        <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        <TaskList filter={filter} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <TodoApp />
    </TaskProvider>
  );
}
