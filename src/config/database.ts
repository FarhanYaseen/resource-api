import { DataSource } from 'typeorm';
import { Task } from '../entities/Task';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.error("DATABASE_URL is not defined");
    process.exit(1);
}

console.log("Database URL:", databaseUrl);
console.log("SSL Enabled:", process.env.DATABASE_SSL);

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    synchronize: isDevelopment,
    logging: isDevelopment,
    entities: [Task],
    migrations: [],
    subscribers: [],
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined, 
});

if (process.env.NODE_ENV !== 'test') {
    AppDataSource.initialize()
        .then(() => {
            console.log('Data Source has been initialized!');
        })
        .catch((err) => {
            console.error('Error during Data Source initialization:', err.message);
            console.error(err.stack);
        });
}
