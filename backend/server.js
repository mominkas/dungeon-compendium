import express from 'express';
import cors from 'cors';
import { getPool, terminateSession } from './db.js'; 
import { router } from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', router);

const initServer = async () => {
    try {
        await getPool();
        console.log('successfully connected to database :)')
        app.listen(5001, () => console.log("listening on port 5001"));
    } catch (error) {
        console.log('Error connecting to db ' + error);
    }
}

initServer();

const terminateDbConnection = async () => {
    try {
        await terminateSession();
    } catch (error) {
        console.log('error disconnecting from the db ' + error);
    } finally {
        process.exit(0)
    }
}

process.on('SIGINT', await terminateDbConnection);
process.on('SIGTERM', await terminateDbConnection);