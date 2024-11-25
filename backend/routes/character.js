import express from 'express';
import {getPool} from "../db.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const query = `SELECT * FROM character ORDER BY name`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});


export default router