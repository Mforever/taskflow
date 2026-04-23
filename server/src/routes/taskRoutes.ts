import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
} from '../controllers/taskController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.put('/reorder', reorderTasks);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

export default router;