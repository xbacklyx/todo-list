import type { Task, FilterType } from '../types';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

interface TaskListProps {
  filter: FilterType;
}

export default function TaskList({ filter }: TaskListProps) {
  const { getFilteredTasks } = useTasks();
  const filteredTasks: Task[] = getFilteredTasks(filter);

  if (filteredTasks.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <ul className="task-list">
      {filteredTasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
