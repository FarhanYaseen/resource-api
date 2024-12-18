import request from "supertest";
import express from "express";
import { createTask, getTasks, getTask, updateTask, deleteTask } from "../controllers/taskController";
import { Model, DataTypes } from 'sequelize';

// Mock Sequelize
jest.mock('sequelize', () => {
    const mSequelize = {
        Model: class {
            static init() { return this; }
            static extend() { return this; }
        },
        DataTypes: {
            UUID: 'uuid',
            UUIDV4: 'uuidv4',
            STRING: 'string',
            BOOLEAN: 'boolean',
            DATE: 'date',
            NOW: 'now'
        }
    };
    return mSequelize;
});

// Mock Task model
jest.mock('../models/Task', () => {
    return {
        Task: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
        }
    };
});

// Mock database connection
jest.mock('../config/database', () => ({
    sequelize: {
        authenticate: jest.fn(),
        define: jest.fn(),
        model: jest.fn(),
    }
}));

// Import Task after mocking
import { Task } from '../models/Task';

// Mock Express App
const app = express();
app.use(express.json());
app.post("/tasks", createTask);
app.get("/tasks", getTasks);
app.get("/tasks/:id", getTask);
app.put("/tasks/:id", updateTask);
app.delete("/tasks/:id", deleteTask);

describe("Tasks API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /tasks", () => {
        it("should create a task", async () => {
            const taskData = {
                title: "Test Task",
                description: "Test description",
                completed: false
            };
            const mockDate = "2024-12-18T19:37:37.255Z";
            const savedTask = {
                id: "123e4567-e89b-12d3-a456-426614174000",
                ...taskData,
                createdAt: mockDate,
                updatedAt: mockDate
            };

            (Task.create as jest.Mock).mockResolvedValue(savedTask);

            const response = await request(app)
                .post("/tasks")
                .send(taskData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(savedTask);
            expect(Task.create).toHaveBeenCalledWith(taskData);
        });

        it("should handle errors when creating a task", async () => {
            const taskData = {
                title: "Test Task",
                description: "Test description",
                completed: false
            };

            (Task.create as jest.Mock).mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .post("/tasks")
                .send(taskData);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Error creating task" });
        });
    });

    describe("GET /tasks", () => {
        it("should retrieve all tasks", async () => {
            const mockDate = "2024-12-18T19:37:37.282Z";
            const tasks = [
                {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    title: "Task 1",
                    description: "Description 1",
                    completed: false,
                    createdAt: mockDate,
                    updatedAt: mockDate
                },
                {
                    id: "223e4567-e89b-12d3-a456-426614174000",
                    title: "Task 2",
                    description: "Description 2",
                    completed: true,
                    createdAt: mockDate,
                    updatedAt: mockDate
                }
            ];

            (Task.findAll as jest.Mock).mockResolvedValue(tasks);

            const response = await request(app).get("/tasks");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(tasks);
            expect(Task.findAll).toHaveBeenCalled();
        });

        it("should handle errors when retrieving tasks", async () => {
            (Task.findAll as jest.Mock).mockRejectedValue(new Error("Database error"));

            const response = await request(app).get("/tasks");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: "Error fetching tasks" });
        });
    });

    describe("GET /tasks/:id", () => {
        it("should retrieve a task by ID", async () => {
            const mockDate = "2024-12-18T19:37:37.288Z";
            const task = {
                id: "123e4567-e89b-12d3-a456-426614174000",
                title: "Task 1",
                description: "Description 1",
                completed: false,
                createdAt: mockDate,
                updatedAt: mockDate
            };

            (Task.findByPk as jest.Mock).mockResolvedValue(task);

            const response = await request(app).get(`/tasks/${task.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(task);
            expect(Task.findByPk).toHaveBeenCalledWith(task.id);
        });

        it("should return 404 when task is not found", async () => {
            (Task.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/tasks/non-existent-id");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Task not found" });
        });
    });

    describe("PUT /tasks/:id", () => {
        it("should update a task by ID", async () => {
            const mockDate = "2024-12-18T19:37:37.291Z";
            const existingTask = {
                id: "123e4567-e89b-12d3-a456-426614174000",
                title: "Task 1",
                description: "Description 1",
                completed: false,
                createdAt: mockDate,
                updatedAt: mockDate,
                update: jest.fn(),
                toJSON: function () {
                    const { update, ...rest } = this;
                    return rest;
                }
            };

            const updateData = { title: "Updated Task" };

            // Mock the update to modify the task in place
            existingTask.update.mockImplementation(async function (data) {
                Object.assign(this, data);
                return this;
            });

            (Task.findByPk as jest.Mock).mockResolvedValue(existingTask);

            const response = await request(app)
                .put(`/tasks/${existingTask.id}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: "123e4567-e89b-12d3-a456-426614174000",
                title: "Updated Task",
                description: "Description 1",
                completed: false,
                createdAt: mockDate,
                updatedAt: mockDate
            });
            expect(Task.findByPk).toHaveBeenCalledWith(existingTask.id);
            expect(existingTask.update).toHaveBeenCalledWith(updateData);
        });

        it("should return 404 when updating non-existent task", async () => {
            (Task.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .put("/tasks/non-existent-id")
                .send({ title: "Updated Task" });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Task not found" });
        });
    });

    describe("DELETE /tasks/:id", () => {
        it("should delete a task by ID", async () => {
            const mockDate = "2024-12-18T19:37:37.291Z";
            const task = {
                id: "123e4567-e89b-12d3-a456-426614174000",
                title: "Task 1",
                description: "Description 1",
                completed: false,
                createdAt: mockDate,
                updatedAt: mockDate,
                destroy: jest.fn()
            };

            (Task.findByPk as jest.Mock).mockResolvedValue(task);
            task.destroy.mockResolvedValue(undefined);

            const response = await request(app).delete(`/tasks/${task.id}`);

            expect(response.status).toBe(204);
            expect(Task.findByPk).toHaveBeenCalledWith(task.id);
            expect(task.destroy).toHaveBeenCalled();
        });

        it("should return 404 when deleting non-existent task", async () => {
            (Task.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete("/tasks/non-existent-id");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Task not found" });
        });
    });
});