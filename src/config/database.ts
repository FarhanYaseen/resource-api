import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.error("DATABASE_URL is not defined");
    process.exit(1);
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    synchronize: true,
    logging: true,
    entities: [Task],
    migrations: [],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false,
    },
});

if (process.env.NODE_ENV !== 'test') {
    AppDataSource.initialize()
        .then(() => {
            const metadata = AppDataSource.getMetadata(Task);
            console.log('Task metadata:', metadata);
            console.log('Data Source has been initialized!');
        })
        .catch((err) => {
            console.error('Error during Data Source initialization:', err.message);
            console.error(err.stack);
        });
}