import { useState, type FormEvent } from 'react';
import type { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { getRelativeTime, isOverdue, formatDateTime, toDatetimeLocal } from '../utils/time';

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  high: '🔴 高',
  medium: '🟡 中',
  low: '🟢 低',
};

export default function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask, updateTask } = useTasks();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(toDatetimeLocal(task.dueDate));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const overdue = !task.completed && isOverdue(task.dueDate);
  const relativeTime = getRelativeTime(task.dueDate);

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editTitle.trim()) return;
    updateTask(task.id, {
      title: editTitle.trim(),
      priority: editPriority,
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
    });
    setEditing(false);
  }

  function handleCancel() {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(toDatetimeLocal(task.dueDate));
    setEditing(false);
  }

  function handleDelete() {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  }

  if (editing) {
    return (
      <li className={`task-item editing priority-${task.priority}`}>
        <form className="edit-form" onSubmit={handleSave}>
          <input
            type="text"
            className="edit-title-input"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            autoFocus
          />
          <div className="edit-options">
            <select
              className="edit-priority-select"
              value={editPriority}
              onChange={e => setEditPriority(e.target.value as Task['priority'])}
            >
              <option value="high">🔴 高优先级</option>
              <option value="medium">🟡 中优先级</option>
              <option value="low">🟢 低优先级</option>
            </select>
            <input
              type="datetime-local"
              className="edit-date-input"
              value={editDueDate}
              onChange={e => setEditDueDate(e.target.value)}
            />
          </div>
          <div className="edit-actions">
            <button type="submit" className="edit-save-btn">保存</button>
            <button type="button" className="edit-cancel-btn" onClick={handleCancel}>取消</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`task-item priority-${task.priority} ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      <div className="task-left">
        <button
          className={`checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => toggleTask(task.id)}
          title={task.completed ? '取消完成' : '标记完成'}
        >
          {task.completed && <span className="checkmark">✓</span>}
        </button>
      </div>

      <div className="task-center" onClick={() => toggleTask(task.id)}>
        <span className="task-title">{task.title}</span>
        <div className="task-meta">
          <span className={`task-priority-label priority-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          {task.dueDate && (
            <span className={`task-due ${overdue ? 'overdue-text' : ''}`}>
              📅 {formatDateTime(task.dueDate)}
              {relativeTime && <span className="relative-time"> · {relativeTime}</span>}
            </span>
          )}
        </div>
      </div>

      <div className="task-right">
        <button className="task-btn edit-btn" onClick={() => setEditing(true)} title="编辑">
          ✏️
        </button>

        {showDeleteConfirm ? (
          <div className="delete-confirm">
            <button className="task-btn confirm-yes" onClick={handleDelete} title="确认删除">
              ✅
            </button>
            <button className="task-btn confirm-no" onClick={() => setShowDeleteConfirm(false)} title="取消">
              ❌
            </button>
          </div>
        ) : (
          <button className="task-btn delete-btn" onClick={() => setShowDeleteConfirm(true)} title="删除">
            🗑️
          </button>
        )}
      </div>
    </li>
  );
}
