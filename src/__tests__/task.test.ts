import request from "supertest";
import express from "express";
import { createTask, getTasks, getTask, updateTask, deleteTask } from "../controllers/taskController";


const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
};

// Mocking AppDataSource dynamically to avoid early access issues
jest.mock("../config/database", () => ({
    AppDataSource: {
        getRepository: jest.fn(() => mockRepository),
    },
}));

// Mock Express App
const app = express();
app.use(express.json());
app.post("/resource", createTask);
app.get("/resource", getTasks);
app.get("/resource/:id", getTask);
app.put("/resource/:id", updateTask);
app.delete("/resource/:id", deleteTask);

describe("Resource API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /resource", () => {
        it("should create a resource", async () => {
            const taskData = { title: "Test Task", description: "Test description", completed: false };
            const savedTask = { id: 1, ...taskData };

            mockRepository.create.mockReturnValue(taskData);
            mockRepository.save.mockResolvedValue(savedTask);

            const response = await request(app)
                .post("/resource")
                .send(taskData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(savedTask);
            expect(mockRepository.create).toHaveBeenCalledWith(taskData);
            expect(mockRepository.save).toHaveBeenCalledWith(taskData);
        });
    });

    describe("GET /resource", () => {
        it("should retrieve all resources", async () => {
            const tasks = [
                { id: 1, title: "Task 1", description: "Description 1", completed: false },
                { id: 2, title: "Task 2", description: "Description 2", completed: true },
            ];

            mockRepository.find.mockResolvedValue(tasks);

            const response = await request(app).get("/resource");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(tasks);
            expect(mockRepository.find).toHaveBeenCalled();
        });
    });

    describe("GET /resource/:id", () => {
        it("should retrieve a resource by ID", async () => {
            const task = { id: 1, title: "Task 1", description: "Description 1", completed: false };

            mockRepository.findOne.mockResolvedValue(task);

            const response = await request(app).get("/resource/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(task);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
        });

    });

    describe("PUT /resource/:id", () => {
        it("should update a resource by ID", async () => {
            const task = { id: 1, title: "Task 1", description: "Description 1", completed: false };
            const updatedTask = { ...task, title: "Updated Task" };

            mockRepository.findOne.mockResolvedValue(task);
            mockRepository.save.mockResolvedValue(updatedTask);

            const response = await request(app)
                .put("/resource/1")
                .send({ title: "Updated Task" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedTask);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
            expect(mockRepository.save).toHaveBeenCalledWith({ ...task, title: "Updated Task" });
        });
    });

    describe("DELETE /resource/:id", () => {
        it("should delete a resource by ID", async () => {
            const task = { id: 1, title: "Task 1", description: "Description 1", completed: false };

            mockRepository.findOne.mockResolvedValue(task);
            mockRepository.remove.mockResolvedValue(task);

            const response = await request(app).delete("/resource/1");

            expect(response.status).toBe(204);
            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
            expect(mockRepository.remove).toHaveBeenCalledWith(task);
        });
    });
});
