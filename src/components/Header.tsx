import { requestNotificationPermission } from '../hooks/useNotification';
import { getNotifyEnabled, setNotifyEnabled } from '../hooks/useNotifierSetting';
import { useState } from 'react';

type NotifyStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

function getNotifyStatus(): NotifyStatus {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return 'prompt';
}

/** 检测当前浏览器名称，用于给出针对性引导 */
function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return '当前浏览器';
}

/** 根据浏览器返回设置路径 */
function getBrowserGuide(): { step1: string; step2: string; step3: string } {
  const browser = getBrowserName();
  switch (browser) {
    case 'Chrome':
      return {
        step1: '点击地址栏左边的 🔒 或 ⓘ 图标',
        step2: '找到「通知」选项，改为「允许」',
        step3: '刷新本页面，然后点击下方"重新检查"',
      };
    case 'Edge':
      return {
        step1: '点击地址栏左边的 🔒 锁图标',
        step2: '在「此网站的权限」中找到「通知」，设为「允许」',
        step3: '刷新本页面，然后点击下方"重新检查"',
      };
    case 'Firefox':
      return {
        step1: '点击地址栏左边的 🔒 图标，选择「连接安全」',
        step2: '找到「权限 → 发送通知」，取消「使用默认」，勾选「允许」',
        step3: '刷新本页面，然后点击下方"重新检查"',
      };
    case 'Safari':
      return {
        step1: '打开 Safari 菜单 →「设置」→「网站」',
        step2: '左侧选择「通知」，找到本网站，改为「允许」',
        step3: '刷新本页面，然后点击下方"重新检查"',
      };
    default:
      return {
        step1: '打开浏览器设置，搜索「通知」或「网站权限」',
        step2: '找到本网站，将通知权限改为「允许」',
        step3: '刷新本页面，然后点击下方"重新检查"',
      };
  }
}

export default function Header() {
  const [notifyStatus, setNotifyStatus] = useState<NotifyStatus>(getNotifyStatus);
  const [userEnabled, setUserEnabled] = useState(getNotifyEnabled);
  const [showGuide, setShowGuide] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  function handleClick() {
    if (notifyStatus === 'prompt') {
      // 首次请求权限
      requestNotificationPermission().then(granted => {
        setNotifyStatus(granted ? 'granted' : 'denied');
      });
    } else if (notifyStatus === 'denied') {
      // 弹出引导
      setShowGuide(true);
    } else if (notifyStatus === 'granted') {
      // 切换菜单
      setShowMenu(prev => !prev);
    }
  }

  function handleToggle(enable: boolean) {
    setUserEnabled(enable);
    setNotifyEnabled(enable);
    setShowMenu(false);
    // 发一条测试通知给用户确认
    if (enable && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('✅ 提醒已开启', {
        body: '您将在任务截止前 24 小时和 3 小时收到提醒。',
        icon: '/favicon.svg',
        tag: 'toggle-on',
      });
    }
  }

  function handleRecheck() {
    const status = getNotifyStatus();
    setNotifyStatus(status);
    setShowGuide(false);
  }

  // 根据状态决定按钮外观
  function getButtonConfig() {
    switch (notifyStatus) {
      case 'granted':
        return userEnabled
          ? { emoji: '🔔', text: '提醒已开启', className: 'notify-btn notify-on' }
          : { emoji: '🔕', text: '提醒已关闭', className: 'notify-btn notify-muted' };
      case 'prompt':
        return { emoji: '🔕', text: '开启提醒', className: 'notify-btn notify-off' };
      case 'denied':
        return { emoji: '🚫', text: '通知被关闭 · 点此查看如何开启', className: 'notify-btn notify-denied' };
      case 'unsupported':
        return { emoji: '⚠️', text: '不支持通知', className: 'notify-btn notify-unsupported' };
    }
  }

  const btnConfig = getButtonConfig();
  const guide = getBrowserGuide();
  const browser = getBrowserName();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          <span className="header-icon">📋</span>
          Todo List
        </h1>
        <p className="header-subtitle">优先级 · 截止时间 · 闹钟提醒</p>
      </div>

      <div className="notify-wrapper">
        <button
          className={btnConfig.className}
          onClick={handleClick}
          disabled={notifyStatus === 'unsupported'}
          title={
            notifyStatus === 'denied'
              ? '点击查看如何在浏览器中开启通知'
              : notifyStatus === 'unsupported'
                ? '当前浏览器不支持桌面通知'
                : notifyStatus === 'granted'
                  ? userEnabled
                    ? '点击关闭提醒'
                    : '点击开启提醒'
                  : '点击开启浏览器桌面通知'
          }
        >
          <span className="notify-emoji">{btnConfig.emoji}</span>
          <span>{btnConfig.text}</span>
          {notifyStatus === 'granted' && <span className="notify-arrow">▾</span>}
        </button>

        {/* 已授权时的开关菜单 */}
        {showMenu && notifyStatus === 'granted' && (
          <>
            <div className="notify-backdrop" onClick={() => setShowMenu(false)} />
            <div className="notify-menu">
              {userEnabled ? (
                <button className="notify-menu-item notify-menu-off" onClick={() => handleToggle(false)}>
                  <span className="menu-icon">🔕</span>
                  <div className="menu-text">
                    <span className="menu-label">关闭提醒</span>
                    <span className="menu-desc">不再发送截止时间通知</span>
                  </div>
                </button>
              ) : (
                <button className="notify-menu-item notify-menu-on" onClick={() => handleToggle(true)}>
                  <span className="menu-icon">🔔</span>
                  <div className="menu-text">
                    <span className="menu-label">开启提醒</span>
                    <span className="menu-desc">截止前 24h 和 3h 各提醒一次</span>
                  </div>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* 引导弹窗 */}
      {showGuide && (
        <div className="guide-overlay" onClick={() => setShowGuide(false)}>
          <div className="guide-modal" onClick={e => e.stopPropagation()}>
            <div className="guide-header">
              <h2 className="guide-title">🔧 如何开启通知权限</h2>
              <button className="guide-close" onClick={() => setShowGuide(false)}>✕</button>
            </div>
            <p className="guide-browser">检测到您正在使用 <strong>{browser}</strong> 浏览器</p>
            <ol className="guide-steps">
              <li>{guide.step1}</li>
              <li>{guide.step2}</li>
              <li>{guide.step3}</li>
            </ol>
            <div className="guide-footer">
              <button className="guide-recheck-btn" onClick={handleRecheck}>
                🔄 重新检查权限状态
              </button>
            </div>
            <p className="guide-hint">
              提示：如果浏览器设置中看不到本网站，请先确保网站已加载完成。通知权限是针对当前域名的（localhost:5173）。
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
