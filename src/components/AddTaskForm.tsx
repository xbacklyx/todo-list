import { useState, type FormEvent } from 'react';
import { useTasks } from '../context/TaskContext';
import type { Task } from '../types';

const PRIORITY_OPTIONS: { value: Task['priority']; label: string; emoji: string }[] = [
  { value: 'high', label: '高', emoji: '🔴' },
  { value: 'medium', label: '中', emoji: '🟡' },
  { value: 'low', label: '低', emoji: '🟢' },
];

export default function AddTaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [expanded, setExpanded] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    addTask(
      title.trim(),
      priority,
      dueDate ? new Date(dueDate).toISOString() : null
    );

    // Reset form
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setExpanded(false);
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <div className="add-task-main">
        <input
          type="text"
          className="add-task-input"
          placeholder="添加新任务..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
        />
        <button type="submit" className="add-task-submit" disabled={!title.trim()}>
          添加
        </button>
      </div>

      {expanded && (
        <div className="add-task-options">
          <div className="priority-selector">
            <span className="option-label">优先级：</span>
            <div className="priority-btns">
              {PRIORITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`priority-btn priority-${opt.value} ${priority === opt.value ? 'active' : ''}`}
                  onClick={() => setPriority(opt.value)}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="due-date-selector">
            <span className="option-label">截止时间：</span>
            <input
              type="datetime-local"
              className="due-date-input"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
            {dueDate && (
              <button
                type="button"
                className="clear-date-btn"
                onClick={() => setDueDate('')}
              >
                清除
              </button>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
