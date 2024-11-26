import express from 'express';
import { getPool } from '../db.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getPool()
        const query = 
        `SELECT e.event_id, e.location, e.start_time, e.completion_status
        FROM event e
        LEFT JOIN campaign c ON e.campaign_id = c.campaign_id
        WHERE e.campaign_id = $1`

        const result = await pool.query(query, [id])
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(400).json({error: "Could not get events " + error})
    }
})

export default router