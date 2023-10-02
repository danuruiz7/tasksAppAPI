import { Router } from 'express';

import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks.controllers.js';

const router = Router();

router.get('/list', getTasks);

router.get('/task/:id', getTask);

router.post('/create', createTask);

router.patch('/update-task/:id', updateTask);

router.delete('/delete-task/:id', deleteTask);

export default router;
