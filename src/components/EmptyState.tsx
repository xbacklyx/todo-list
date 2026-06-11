import type { FilterType } from '../types';

interface EmptyStateProps {
  filter: FilterType;
}

export default function EmptyState({ filter }: EmptyStateProps) {
  const messages: Record<FilterType, { emoji: string; title: string; desc: string }> = {
    all: {
      emoji: '📝',
      title: '还没有任务',
      desc: '在上方添加你的第一个任务吧！设置优先级和截止时间，到点会有闹钟提醒。',
    },
    active: {
      emoji: '🎉',
      title: '所有任务都完成了',
      desc: '干得漂亮！可以放松一下，或者创建新任务继续前进。',
    },
    completed: {
      emoji: '📋',
      title: '还没有已完成的任务',
      desc: '开始完成一些任务吧，完成的记录会显示在这里。',
    },
  };

  const msg = messages[filter];

  return (
    <div className="empty-state">
      <span className="empty-emoji">{msg.emoji}</span>
      <h3 className="empty-title">{msg.title}</h3>
      <p className="empty-desc">{msg.desc}</p>
    </div>
  );
}
