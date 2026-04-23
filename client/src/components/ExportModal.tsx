import React, { useState } from 'react';
import type { Task } from '../types';
import Modal from './Modal';
import { Download, FileText, FileSpreadsheet, Code, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

type ExportFormat = 'csv' | 'json' | 'html';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, tasks }) => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const exportAsCSV = () => {
    const headers = ['Название', 'Описание', 'Приоритет', 'Статус', 'Дедлайн', 'Создана', 'Обновлена'];

    const rows = tasks.map(task => [
      task.title,
      task.description || '',
      task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий',
      task.status === 'completed' ? 'Выполнена' : 'Активна',
      task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : '',
      new Date(task.createdAt).toLocaleString('ru-RU'),
      new Date(task.updatedAt).toLocaleString('ru-RU')
    ]);

    let csvContent = includeHeaders
      ? [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
      : rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `tasks_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportAsJSON = () => {
    const exportData = includeHeaders ? tasks : tasks.map(({ _id, userId, ...task }) => task);
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `tasks_${new Date().toISOString().split('T')[0]}.json`);
  };

  const exportAsHTML = () => {
    let html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TaskFlow - Отчет по задачам</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 30px; border-radius: 16px; margin-bottom: 24px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        table { width: 100%; background: white; border-radius: 12px; overflow-x: auto; display: block; }
        th { background: #f8fafc; padding: 12px; text-align: left; font-weight: 600; }
        td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
        .priority-high { color: #dc2626; font-weight: 500; }
        .priority-medium { color: #eab308; font-weight: 500; }
        .priority-low { color: #22c55e; font-weight: 500; }
        @media (max-width: 768px) {
          body { padding: 12px; }
          .header { padding: 20px; }
          th, td { padding: 8px; font-size: 12px; }
          .stat-card { padding: 12px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TaskFlow - Отчет по задачам</h1>
          <p>Сгенерировано: ${new Date().toLocaleString('ru-RU')}</p>
        </div>
        <div class="stats">
          <div class="stat-card"><strong>Всего задач:</strong> ${tasks.length}</div>
          <div class="stat-card"><strong>Выполнено:</strong> ${tasks.filter(t => t.status === 'completed').length}</div>
          <div class="stat-card"><strong>Активных:</strong> ${tasks.filter(t => t.status === 'pending').length}</div>
        </div>
        <div style="overflow-x: auto;">
          <table>
            <thead><tr><th>Название</th><th>Приоритет</th><th>Статус</th><th>Дедлайн</th></tr></thead>
            <tbody>
              ${tasks.map(task => `
                <tr>
                  <td>${escapeHtml(task.title)}</td>
                  <td class="priority-${task.priority}">${task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}</td>
                  <td>${task.status === 'completed' ? 'Выполнена' : 'Активна'}</td>
                  <td>${task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>`;

    const blob = new Blob([html], { type: 'text/html' });
    downloadBlob(blob, `tasks_report_${new Date().toISOString().split('T')[0]}.html`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Экспортировано ${tasks.length} задач`);
    onClose();
  };

  const handleExport = () => {
    switch (format) {
      case 'csv': exportAsCSV(); break;
      case 'json': exportAsJSON(); break;
      case 'html': exportAsHTML(); break;
    }
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const getFormatIcon = (fmt: ExportFormat) => {
    if (fmt === 'csv') return <FileSpreadsheet className="w-5 h-5" />;
    if (fmt === 'json') return <Code className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getFormatTitle = (fmt: ExportFormat) => {
    if (fmt === 'csv') return 'CSV';
    if (fmt === 'json') return 'JSON';
    return 'HTML';
  };

  const getFormatDesc = (fmt: ExportFormat) => {
    if (fmt === 'csv') return 'Для Excel / Google Sheets';
    if (fmt === 'json') return 'Для разработчиков';
    return 'Красивый HTML отчет';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Экспорт задач">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Формат экспорта
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['csv', 'json', 'html'] as ExportFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                  ${format === fmt
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${format === fmt
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {getFormatIcon(fmt)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {getFormatTitle(fmt)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {getFormatDesc(fmt)}
                  </p>
                </div>
                {format === fmt && (
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <label className="flex items-center gap-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={includeHeaders}
              onChange={(e) => setIncludeHeaders(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Включить заголовки
            </span>
          </label>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleExport}
              className="btn-primary flex items-center justify-center gap-2 w-full"
            >
              <Download className="w-4 h-4" />
              Экспортировать ({tasks.length})
            </button>
            <button
              onClick={onClose}
              className="btn-secondary w-full"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;