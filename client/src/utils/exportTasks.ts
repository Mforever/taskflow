import type { Task } from '../types';

export const exportTasksToCSV = (tasks: Task[]) => {
  // Заголовки на русском
  const headers = [
    'Название',
    'Описание',
    'Приоритет',
    'Статус',
    'Дедлайн',
    'Создана',
    'Обновлена'
  ];

  // Форматируем данные
  const rows = tasks.map(task => [
    formatCSVValue(task.title),
    formatCSVValue(task.description || ''),
    getPriorityText(task.priority),
    task.status === 'completed' ? 'Выполнена' : 'Активна',
    task.deadline ? formatDate(task.deadline) : '',
    formatDate(task.createdAt),
    formatDate(task.updatedAt)
  ]);

  // Создаем CSV с BOM для правильной кодировки
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  // Добавляем BOM (Byte Order Mark) для UTF-8
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  // Скачиваем файл
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', `tasks_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Форматирование значений для CSV (экранирование кавычек и запятых)
const formatCSVValue = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    // Экранируем кавычки и оборачиваем в двойные кавычки
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  return value;
};

// Получение текста приоритета
const getPriorityText = (priority: string): string => {
  switch (priority) {
    case 'high': return 'Высокий';
    case 'medium': return 'Средний';
    case 'low': return 'Низкий';
    default: return priority;
  }
};

// Форматирование даты
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};