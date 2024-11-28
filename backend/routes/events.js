import express from 'express';
import { getPool } from '../db.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getPool()
        const query = 
        `SELECT e.event_id, e.location, e.start_time, e.completion_status,
        CASE 
        WHEN ce.event_id IS NOT NULL THEN 'Combat Encounter'
        WHEN se.event_id IS NOT NULL THEN 'Social Encounter'
        END AS type
        FROM event e
        LEFT JOIN campaign c ON e.campaign_id = c.campaign_id
        LEFT JOIN combat_encounter ce ON e.event_id = ce.event_id
        LEFT JOIN social_encounter se ON e.event_id = se.event_id
        WHERE e.campaign_id = $1`

        const result = await pool.query(query, [id])
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(400).json({error: "Could not get events " + error})
    }
})

router.get('/details/:id', async (req, res) => {
    const {id} = req.params;

    console.log('Received ID:', id);
    console.log('Request params:', req.params);
    console.log('Request path:', req.path);
    try {
        const pool = await getPool()
        const query = `
        SELECT 'Combat Encounter' AS type,
            ce.combat_encounter_id,
            ce.terrain,
            ce.visibility,
            ce.first_turn,
            ce.turn_order,
            ce.event_id
        FROM combat_encounter ce
        WHERE ce.event_id = $1

        UNION ALL

        SELECT 'Social Encounter' AS type,
            se.social_encounter_id,
            se.social_setting,
            NULL AS visibility,
            se.action,
            NULL AS turn_order,
            se.event_id
        FROM social_encounter se
        WHERE se.event_id = $1;`

        const result = await pool.query(query, [id])
        res.status(200).json(result.rows)
        
    } catch (error) {
        res.status(400).json({error: "Could not get event details " + error})
    }
})

export default router