const SETTING_KEY = 'todo-notify-enabled';

/** 读取用户的通知开关设置（默认开启） */
export function getNotifyEnabled(): boolean {
  try {
    const raw = localStorage.getItem(SETTING_KEY);
    if (raw === null) return true; // 默认开启
    return JSON.parse(raw);
  } catch {
    return true;
  }
}

/** 保存用户的通知开关设置 */
export function setNotifyEnabled(enabled: boolean) {
  localStorage.setItem(SETTING_KEY, JSON.stringify(enabled));
}
