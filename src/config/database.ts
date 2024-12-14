import dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [Task],
    migrations: [],
    subscribers: [],
});
