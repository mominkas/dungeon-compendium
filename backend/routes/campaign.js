import express from 'express';
import { getPool } from '../db.js';

const router = express.Router();

router.get("/:id", async (req, res) => {
    const { id } = req.params
    const attrs = ['c.campaign_id', 'c.campaign_name', "c.meeting_location", 'c.meeting_time', 'c.setting', 'c.difficulty_level', 'c.max_num_players', 'c.current_num_players', 'c.description']
    try {
        const pool = await getPool();

        const query =
        `SELECT DISTINCT ${attrs.join(', ')},     
        CASE 
        WHEN gm.game_master_id = $1 THEN 'Game Master'
        WHEN gp.game_player_id = $1 THEN 'Player'
        END as role
        FROM campaign c
        LEFT JOIN game_master gm ON c.game_master_id = gm.game_master_id
        LEFT JOIN enroll e ON c.campaign_id = e.campaign_id
        LEFT JOIN game_player gp ON e.game_player_id = gp.game_player_id
        WHERE gm.game_master_id = $1 OR gp.game_player_id = $1`
        
        const result = await pool.query(query, [id])
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(400).json({error: "Could not get campaigns " + error})
    }
})

export default router