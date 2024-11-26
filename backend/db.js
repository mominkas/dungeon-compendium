import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

// we want to create the db if it doesnt exist. Streamlines process, no need for manual creation
const createDb = async () => {
    // connect to default first
    const defaultPool = new Pool({
        user: process.env.USER_NAME,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        port: process.env.PORT,
        database: "postgres"
    });

    try {
        // check if db exists
        const db = await defaultPool.query("SELECT 1 FROM pg_database WHERE datname=$1",
        [process.env.DATABASE]);

        //create db if it does not exist
        if  (db.rowCount === 0) {
            await defaultPool.query(`CREATE DATABASE ${process.env.DATABASE}`);
        }

    } catch (error) {
        console.error("Error creating db " + error)
        
    } finally {
        await defaultPool.end()
    }
}

const terminateSession = async () => {
    if (pool) {
        await pool.end();
    }
}

// our main pool
const pool = new Pool({
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE
})

const getPool = async () => {
    await createDb();
    return pool;
}

export {getPool, terminateSession};