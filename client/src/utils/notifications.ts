export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Уведомления разрешены');
    }
  }
};

export const showTaskReminder = (taskTitle: string, deadline: string) => {
  if (Notification.permission === 'granted') {
    new Notification('Напоминание о задаче', {
      body: `${taskTitle} - Дедлайн: ${new Date(deadline).toLocaleDateString('ru-RU')}`,
      icon: '/vite.svg',
    });
  }
};