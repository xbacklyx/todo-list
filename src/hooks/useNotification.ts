import { useEffect, useRef } from 'react';
import type { Task } from '../types';
import { getNotifyEnabled } from './useNotifierSetting';

const NOTIFIED_KEY = 'todo-notified-milestones';

/**
 * Notified milestones are stored as `{taskId}:24h` and `{taskId}:3h`.
 */
type Milestone = '24h' | '3h';

function getNotifiedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function saveNotifiedSet(entries: Set<string>) {
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...entries]));
}

function milestoneKey(taskId: string, milestone: Milestone): string {
  return `${taskId}:${milestone}`;
}

/**
 * Request notification permission. Returns true if granted.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/**
 * Hook that checks incomplete tasks with due dates every 30 seconds.
 * Fires notifications at 24h and 3h before the deadline.
 */
export function useNotification(tasks: Task[]) {
  const notifiedRef = useRef(getNotifiedSet());

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (!getNotifyEnabled()) return;

    const interval = setInterval(() => {
      const now = Date.now();

      tasks.forEach(task => {
        if (task.completed || !task.dueDate) return;

        const dueTime = new Date(task.dueDate).getTime();
        const remaining = dueTime - now;

        // Deadline already passed — skip
        if (remaining <= 0) return;

        const hours24 = 24 * 60 * 60 * 1000;
        const hours3 = 3 * 60 * 60 * 1000;

        let milestone: Milestone | null = null;

        // Within 3h window AND hasn't fired 3h notification yet
        if (remaining <= hours3) {
          const key = milestoneKey(task.id, '3h');
          if (!notifiedRef.current.has(key)) {
            milestone = '3h';
            notifiedRef.current.add(key);
          }
        }

        // Within 24h window (but more than 3h) AND hasn't fired 24h notification yet
        if (!milestone && remaining <= hours24 && remaining > hours3) {
          const key = milestoneKey(task.id, '24h');
          if (!notifiedRef.current.has(key)) {
            milestone = '24h';
            notifiedRef.current.add(key);
          }
        }

        if (milestone) {
          saveNotifiedSet(notifiedRef.current);

          const timeStr = new Date(task.dueDate!).toLocaleString('zh-CN', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          const remainingStr = milestone === '24h' ? '24小时' : '3小时';

          new Notification(`⏰ ${task.title}`, {
            body: `您的任务即将截止，请赶快完成！\n\n📅 截止时间：${timeStr}\n⏳ 距离截止还有 ${remainingStr}`,
            icon: '/favicon.svg',
            tag: milestoneKey(task.id, milestone),
          });
        }
      });
    }, 30_000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [tasks]);

  // Clean notified entries when tasks are deleted
  useEffect(() => {
    const existingIds = new Set(tasks.map(t => t.id));
    let changed = false;
    notifiedRef.current.forEach(entry => {
      // entry format: "taskId:24h" or "taskId:3h"
      const taskId = entry.split(':')[0];
      if (!existingIds.has(taskId)) {
        notifiedRef.current.delete(entry);
        changed = true;
      }
    });
    if (changed) saveNotifiedSet(notifiedRef.current);
  }, [tasks]);
}
