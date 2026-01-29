// 分を「X時間Y分」形式にフォーマット
export function formatDuration(minutes: number): string {
  if (minutes < 0) return '0分';

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    return `${mins}分`;
  }
  if (mins === 0) {
    return `${hours}時間`;
  }
  return `${hours}時間${mins}分`;
}

// 日時を「HH:MM」形式にフォーマット（日本時間）
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  });
}

// 日時を「YYYY-MM-DD HH:MM」形式にフォーマット（日本時間）
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
  });
}
