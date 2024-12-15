import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/resource', taskRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Service is healthy' });
});

export default app;
