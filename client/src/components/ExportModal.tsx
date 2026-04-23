import React, { useState } from 'react';
import type { Task } from '../types';
import Modal from './Modal';
import { Download, FileText, FileSpreadsheet, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

type ExportFormat = 'csv' | 'json' | 'pretty';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, tasks }) => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const exportAsCSV = () => {
    const headers = [
      'Название',
      'Описание',
      'Приоритет',
      'Статус',
      'Дедлайн',
      'Создана',
      'Обновлена'
    ];

    const rows = tasks.map(task => [
      task.title,
      task.description || '',
      task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий',
      task.status === 'completed' ? 'Выполнена' : 'Активна',
      task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : '',
      new Date(task.createdAt).toLocaleString('ru-RU'),
      new Date(task.updatedAt).toLocaleString('ru-RU')
    ]);

    let csvContent = includeHeaders ? [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n') : rows.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `tasks_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportAsJSON = () => {
    const exportData = includeHeaders ? tasks : tasks.map(({ _id, userId, ...task }) => task);
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `tasks_${new Date().toISOString().split('T')[0]}.json`);
  };

  const exportAsPretty = () => {
    let html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>TaskFlow - Экспорт задач</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }
        h1 {
          color: #333;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 10px;
        }
        .stats {
          background: white;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        table {
          width: 100%;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        th {
          background: #3b82f6;
          color: white;
          padding: 12px;
          text-align: left;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e5e5;
        }
        tr:hover {
          background: #f0f9ff;
        }
        .priority-high { color: #ef4444; font-weight: 500; }
        .priority-medium { color: #eab308; font-weight: 500; }
        .priority-low { color: #22c55e; font-weight: 500; }
        .status-completed { color: #22c55e; }
        .status-pending { color: #3b82f6; }
        .footer {
          margin-top: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <h1>📋 TaskFlow - Отчет по задачам</h1>
      <div class="stats">
        <strong>📊 Статистика:</strong> Всего задач: ${tasks.length} | 
        Выполнено: ${tasks.filter(t => t.status === 'completed').length} | 
        Активных: ${tasks.filter(t => t.status === 'pending').length}
      </div>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Приоритет</th>
            <th>Статус</th>
            <th>Дедлайн</th>
            <th>Создана</th>
          </tr>
        </thead>
        <tbody>
          ${tasks.map(task => `
            <tr>
              <td>${escapeHtml(task.title)}</td>
              <td>${escapeHtml(task.description || '—')}</td>
              <td class="priority-${task.priority}">${getPriorityText(task.priority)}</td>
              <td class="status-${task.status}">${task.status === 'completed' ? '✓ Выполнена' : '○ Активна'}</td>
              <td>${task.deadline ? new Date(task.deadline).toLocaleDateString('ru-RU') : '—'}</td>
              <td>${new Date(task.createdAt).toLocaleString('ru-RU')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        Сгенерировано ${new Date().toLocaleString('ru-RU')}
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
      case 'csv':
        exportAsCSV();
        break;
      case 'json':
        exportAsJSON();
        break;
      case 'pretty':
        exportAsPretty();
        break;
    }
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Экспорт задач">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Формат экспорта
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setFormat('csv')}
              className={`p-4 rounded-xl border-2 transition-all ${format === 'csv' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
            >
              <FileSpreadsheet className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">CSV</p>
              <p className="text-xs text-gray-500">Для Excel/Google Sheets</p>
            </button>

            <button
              onClick={() => setFormat('json')}
              className={`p-4 rounded-xl border-2 transition-all ${format === 'json' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
            >
              <FileText className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-sm font-medium">JSON</p>
              <p className="text-xs text-gray-500">Для разработчиков</p>
            </button>

            <button
              onClick={() => setFormat('pretty')}
              className={`p-4 rounded-xl border-2 transition-all ${format === 'pretty' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
            >
              <Download className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">HTML отчет</p>
              <p className="text-xs text-gray-500">Красивый отчет</p>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHeaders}
              onChange={(e) => setIncludeHeaders(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Включить заголовки (для CSV/JSON)
            </span>
          </label>

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary">
              Отмена
            </button>
            <button onClick={handleExport} className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Экспортировать ({tasks.length})
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;