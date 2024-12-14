import request from "supertest";
import express from "express";
import ResourceRouter from "./taskRoutes";
import { AppDataSource } from "../config/database";

jest.mock("../config/database");

const app = express();
app.use(express.json());
app.use("/resource", ResourceRouter);

const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

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

        it("should return validation error for invalid data", async () => {
            const response = await request(app)
                .post("/resource")
                .send({ title: "" });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error");
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

        it("should handle database errors during fetching", async () => {
            mockRepository.find.mockRejectedValue(new Error("Database error"));

            const response = await request(app).get("/resource");

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("error", "Error fetching tasks");
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

        it("should return 404 if resource is not found", async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const response = await request(app).get("/resource/999");

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Task not found");
        });

        it("should handle database errors during fetching by ID", async () => {
            mockRepository.findOne.mockRejectedValue(new Error("Database error"));

            const response = await request(app).get("/resource/1");

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("error", "Error fetching task");
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

        it("should return 404 if resource to update is not found", async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const response = await request(app)
                .put("/resource/999")
                .send({ title: "Updated Task" });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Task not found");
        });

        it("should handle database errors during update", async () => {
            const task = { id: 1, title: "Task 1", description: "Description 1", completed: false };
            mockRepository.findOne.mockResolvedValue(task);
            mockRepository.save.mockRejectedValue(new Error("Database error"));

            const response = await request(app)
                .put("/resource/1")
                .send({ title: "Updated Task" });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("error", "Error updating task");
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

        it("should return 404 if resource to delete is not found", async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const response = await request(app).delete("/resource/999");

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "Task not found");
        });

        it("should handle database errors during delete", async () => {
            mockRepository.findOne.mockRejectedValue(new Error("Database error"));

            const response = await request(app).delete("/resource/1");

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("error", "Error deleting task");
        });
    });
});
