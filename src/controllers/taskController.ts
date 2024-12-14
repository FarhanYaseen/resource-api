// src/controllers/taskController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Task } from '../entities/Task';

const taskRepository = AppDataSource.getRepository(Task);

export const createTask = async (req: Request, res: Response) => {
    try {
        const task = taskRepository.create(req.body);
        const result = await taskRepository.save(task);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
};

export const getTasks = async (_req: Request, res: Response) => {
    try {
        const tasks = await taskRepository.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
};

export const getTask = async (req: Request, res: Response) => {
    try {
        const task = await taskRepository.findOne({ where: { id: req.params.id } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching task' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const task = await taskRepository.findOne({ where: { id: req.params.id } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        taskRepository.merge(task, req.body);
        const result = await taskRepository.save(task);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error updating task' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const task = await taskRepository.findOne({ where: { id: req.params.id } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await taskRepository.remove(task);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
};