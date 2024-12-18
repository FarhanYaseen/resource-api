

import app from './app';
import { sequelize } from './config/database';

const PORT = process.env.PORT || 8080;

(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synchronized.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize the server:', error.message);
    }
})();
