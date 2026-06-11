import type { FilterType } from '../types';
import { useTasks } from '../context/TaskContext';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '未完成' },
  { key: 'completed', label: '已完成' },
];

export default function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  const { tasks } = useTasks();
  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="filter-bar">
      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`filter-tab ${currentFilter === f.key ? 'active' : ''}`}
            onClick={() => onFilterChange(f.key)}
          >
            {f.label}
            {f.key === 'all' && <span className="filter-count">{tasks.length}</span>}
            {f.key === 'active' && <span className="filter-count">{activeCount}</span>}
            {f.key === 'completed' && <span className="filter-count">{completedCount}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
