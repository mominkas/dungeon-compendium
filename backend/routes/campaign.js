import express from 'express';
import { getPool } from '../db.js';

const router = express.Router();

router.get('/popularDifficulty', async (req, res) => {
    try {
        const pool = await getPool()
        const query= `
        SELECT 
            c1.difficulty_level,
            AVG(c1.current_num_players * 1.0 / c1.max_num_players) AS avg_ratio
        FROM campaign c1
        GROUP BY c1.difficulty_level
        HAVING AVG(c1.current_num_players * 1.0 / c1.max_num_players) >= ALL (
            SELECT AVG(c2.current_num_players * 1.0 / c2.max_num_players)
            FROM campaign c2
            GROUP BY c2.difficulty_level);`

        const result = await pool.query(query)
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch popular difficulty ' + error });
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    const { difficulty } = req.query
    const attrs = ['c.campaign_id', 'c.campaign_name', "c.meeting_location", 'c.meeting_time', 'c.setting', 'c.difficulty_level', 'c.max_num_players', 'c.current_num_players', 'c.description']
    try {
        const pool = await getPool();

        const params = [id]

        let query = `
        SELECT * FROM (SELECT ${attrs.join(', ')}, 'Game Master' as role
        FROM campaign c
        JOIN game_master gm ON c.game_master_id = gm.game_master_id
        WHERE gm.game_master_id = $1

        UNION

        SELECT ${attrs.join(', ')}, 'Player' as role
        FROM campaign c
        JOIN enroll e ON c.campaign_id = e.campaign_id
        JOIN game_player gp ON e.game_player_id = gp.game_player_id
        WHERE gp.game_player_id = $1
        ) combined_campaigns
        ${difficulty && difficulty !== 'all' ? 'WHERE difficulty_level = $2' : ''}`

        if (difficulty && difficulty !== 'all') {
            params.push(difficulty)
        }
        
        const result = await pool.query(query, params)
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(400).json({error: "Could not get campaigns " + error})
    }
})

router.get('/players/:id', async (req,res) => {
    const {id} = req.params;
    try {
        const pool = await getPool();
        const query = `
        SELECT p.participant_id, p.name FROM campaign c
        JOIN enroll e ON c.campaign_id = e.campaign_id
        JOIN game_player gp ON e.game_player_id = gp.game_player_id
        JOIN participant p ON gp.game_player_id = p.participant_id
        WHERE c.campaign_id = $1;`

        const result = await pool.query(query, [id])
        res.status(200).json(result.rows)

    } catch (error) {
        res.status(400).json({error: "Could not get players " + error})
    }
})

router.get('/:gmId/:id', async (req,res) => {
    const {gmId, id} = req.params;
    try {
        const pool = await getPool();
        const query = `
        SELECT p.participant_id, p.name
        FROM participant p
        WHERE NOT EXISTS (
            SELECT 1 FROM campaign c 
            JOIN enroll e ON c.campaign_id = e.campaign_id
            JOIN game_player gp ON e.game_player_id = gp.game_player_id
            WHERE gp.game_player_id = p.participant_id 
            AND c.campaign_id = $1

        )
            AND p.participant_id != $2`

        const result = await pool.query(query, [id, gmId])
        res.status(200).json(result.rows)

    } catch (error) {
        res.status(400).json({error: "Could not get players " + error})
    }
})

router.post('/add-players/:id', async (req, res) => {
    const campaignId = req.params.id;
    const { playerIds, date } = req.body;

    try {
        const pool = await getPool();
        
        try {
            await pool.query('BEGIN');

            for (const playerId of playerIds) {
                const insertPlayerQuery = `
                    INSERT INTO Game_Player (game_player_id)
                    VALUES ($1)
                    ON CONFLICT (game_player_id) DO NOTHING
                `;
                await pool.query(insertPlayerQuery, [playerId]);
            }

            for (const playerId of playerIds) {
                const insertQuery = `
                    INSERT INTO Enroll (game_player_id, campaign_id, date_joined)
                    VALUES ($1, $2, $3)
                `;
                await pool.query(insertQuery, [playerId, campaignId, date]);
            }

            const updateCampaignQuery = `
                UPDATE Campaign 
                SET current_num_players = current_num_players + $1
                WHERE campaign_id = $2
            `;
            await pool.query(updateCampaignQuery, [playerIds.length, campaignId]);

            await pool.query('COMMIT');

            const getPlayersQuery = `
                SELECT p.participant_id, p.name
                FROM Participant p
                INNER JOIN Game_Player gp ON gp.game_player_id = p.participant_id
                INNER JOIN Enroll e ON e.game_player_id = gp.game_player_id
                WHERE e.campaign_id = $1
            `;
            const result = await pool.query(getPlayersQuery, [campaignId]);
            
            res.json(result.rows);
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to add players to campaign ' + err });
    }
});

router.post('/create', async (req,res) => {
    const {campaign_name, meeting_location, meeting_time, setting, difficulty_level, max_num_players, current_num_players, description, date_created, game_master_id} = req.body

    try {
        const pool = await getPool();
        const insertGMQuery = `
        INSERT INTO game_master (game_master_id)
        VALUES ($1)
        On CONFLICT (game_master_id) DO NOTHING`
        const insertResult = await pool.query(insertGMQuery, [game_master_id])

        const campaignQuery =  `
        INSERT INTO campaign (campaign_name, meeting_location, meeting_time, setting, difficulty_level, max_num_players, current_num_players, description, date_created, game_master_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

        const values = [campaign_name, meeting_location, meeting_time, setting, difficulty_level, max_num_players, current_num_players, description, date_created, game_master_id]
        const result = await pool.query(campaignQuery, values)

        res.status(200).json(result.rows[0])
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to add players to campaign ' + error });
    }
})

export default router