import { Workbox } from 'workbox-window';

export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    wb.register();
  }
};