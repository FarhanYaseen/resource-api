import { Router } from 'express';
import { createTask, getTasks, getTask, updateTask, deleteTask } from '../controllers/taskController';
import { validateRequest } from '../middleware/validateRequest';
import { createTaskSchema, updateTaskSchema } from '../validation/taskSchema';

const router = Router();

router.post('/', validateRequest(createTaskSchema), createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', validateRequest(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
