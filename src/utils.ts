// Fonctions utilitaires

export function showNotification(message: string): void {
  const notification = document.createElement('div');
  notification.className = 'theme-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    z-index: 10000;
    animation: slideIn 0.3s ease, fadeOut 0.3s ease 2s;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2500);
}

export function colorWithAlpha(color: string, alpha: number): string {
  if (!color) {
    return `rgba(255,255,255,${alpha})`;
  }

  if (color.startsWith('#')) {
    let hex = color.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(ch => ch + ch).join('');
    }
    const intVal = parseInt(hex, 16);
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (color.startsWith('rgb')) {
    const values = color
      .replace(/rgba?\(/, '')
      .replace(')', '')
      .split(',')
      .map(v => Number(v.trim()));
    const [r = 255, g = 255, b = 255] = values;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return `rgba(255,255,255,${alpha})`;
}
