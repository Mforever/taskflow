import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Circle, CheckCircle, Edit2, Trash2, GripVertical } from 'lucide-react';
import type { Task } from '../types';

interface SortableTaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isCompleted = task.status === 'completed';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card p-4 group hover:shadow-xl transition-all ${isCompleted ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        <button
          onClick={() => onToggle(task)}
          className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
        >
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
          )}
        </button>

        <div className="flex-1">
          <p className={`text-gray-800 dark:text-gray-200 font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </p>

          {task.description && (
            <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${isCompleted ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority === 'high' ? '🔴 Высокий' : task.priority === 'medium' ? '🟡 Средний' : '🟢 Низкий'}
            </span>

            {task.deadline && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                📅 {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}

            {task.status === 'completed' && (
              <span className="text-xs text-green-600 dark:text-green-400">
                ✓ Выполнена
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-blue-500" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortableTaskItem;