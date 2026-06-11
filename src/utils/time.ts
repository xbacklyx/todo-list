/**
 * Format a due date into a human-readable relative time string.
 * Returns null if dueDate is null.
 */
export function getRelativeTime(dueDate: string | null): string | null {
  if (!dueDate) return null;

  const now = Date.now();
  const due = new Date(dueDate).getTime();
  const diff = due - now;

  const absDiff = Math.abs(diff);
  const minutes = Math.floor(absDiff / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diff < 0) {
    // Overdue
    if (minutes < 1) return '刚刚过期';
    if (minutes < 60) return `已过期 ${minutes} 分钟`;
    if (hours < 24) return `已过期 ${hours} 小时`;
    if (days < 30) return `已过期 ${days} 天`;
    return `已过期 ${Math.floor(days / 30)} 个月`;
  } else {
    // Upcoming
    if (minutes < 1) return '即将到期';
    if (minutes < 60) return `还有 ${minutes} 分钟`;
    if (hours < 24) return `还有 ${hours} 小时`;
    if (days < 30) return `还有 ${days} 天`;
    return `还有 ${Math.floor(days / 30)} 个月`;
  }
}

/**
 * Check if a due date is in the past.
 */
export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate).getTime() < Date.now();
}

/**
 * Format ISO datetime to a readable local string.
 */
export function formatDateTime(isoString: string | null): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format ISO datetime for datetime-local input value.
 */
export function toDatetimeLocal(isoString: string | null): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}
