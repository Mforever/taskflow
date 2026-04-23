import { Response } from 'express';
import Task from '../models/Task.js';
import { AuthRequest } from '../middleware/auth.js';

export const getTasks = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ order: 1, createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка получения задач' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { title, description, priority, deadline } = req.body;

    const lastTask = await Task.findOne({ userId: req.userId }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      priority,
      deadline,
      order
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка создания задачи' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка обновления задачи' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }

    await task.deleteOne();
    return res.json({ message: 'Задача удалена' });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка удаления задачи' });
  }
};

export const reorderTasks = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { tasks } = req.body;

    for (const task of tasks) {
      await Task.findOneAndUpdate(
        { _id: task.id, userId: req.userId },
        { order: task.order }
      );
    }

    return res.json({ message: 'Порядок обновлен' });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка обновления порядка' });
  }
};