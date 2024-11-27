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

router.get('/:participantId', async (req, res) => {
    try {
        const pool = await getPool();
        const participantId = req.params.participantId;
        const query = `SELECT * FROM character WHERE participant_id = $1 ORDER BY name`;
        const result = await pool.query(query, [participantId]);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.post('/add/:participantId', async (req, res) => {
    try {
        const pool = await getPool();
        const {
            name,
            hair_color,
            eye_color,
            level,
            position,
            class_name,
            species_name,
            rollForHP,
            hitPointsCustom
        } = req.body;

        // need to update with true partipant ID
        const participant_id = req.body.participant_id;

        if (!name || !class_name || !level || !species_name || !participant_id) {
            return res.status(400).json({error: "Missing a required field"});
        }

        const hitDieQuery = 'SELECT hit_die FROM class_description WHERE name = $1 LIMIT 1'
        const hitDieResult = await pool.query(hitDieQuery, [class_name]);

        if (hitDieResult.rows.length === 0) {
            return res.status(400).json({error: "Invalid class name"});
        }

        const hitDieString = hitDieResult.rows[0].hit_die;
        const hitDieValue = parseInt(hitDieString.substring(1));

        let hp;
        if (rollForHP) {
            hp = 0;
            for (let i = 0; i < level; i++) {
                const roll = Math.floor(Math.random() * hitDieValue) + 1;
                hp += roll;
            }
        } else {
            if(!hitPointsCustom) {
                return res.status(400).json({error: "Custom HP value was required"});
            }
            hp = parseInt(hitPointsCustom);
            if (isNaN(hp) || hp < 1) {
                return res.status(400).json({error: "Invalid HP value!"});
            }
        }


        const query = `
            INSERT INTO character
            (name, hair_color, eye_color, level, position, class_name, species_name, hp, participant_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING name
        `;

        const values = [name, hair_color, eye_color, level, position, class_name, species_name, hp, participant_id];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
    }
});

router.post('/edit', async (req, res) => {
    try {
        const pool = await getPool();

        const {
            name,
            hair_color,
            eye_color,
            level,
            position,
            class_name,
            species_name,
            rollForHP,
            hitPointsCustom,
            character_id
        } = req.body;

        const hitDieQuery = 'SELECT hit_die FROM class_description WHERE name = $1 LIMIT 1'
        const hitDieResult = await pool.query(hitDieQuery, [class_name]);

        if (hitDieResult.rows.length === 0) {
            return res.status(400).json({error: "Invalid class name"});
        }

        const hitDieString = hitDieResult.rows[0].hit_die;
        const hitDieValue = parseInt(hitDieString.substring(1));

        let hp;
        if (rollForHP) {
            hp = 0;
            for (let i = 0; i < level; i++) {
                const roll = Math.floor(Math.random() * hitDieValue) + 1;
                hp += roll;
            }
        } else {
            if(!hitPointsCustom) {
                return res.status(400).json({error: "Custom HP value was required"});
            }
            hp = parseInt(hitPointsCustom);
            if (isNaN(hp) || hp < 1) {
                return res.status(400).json({error: "Invalid HP value!"});
            }
        }


        const query = `
            UPDATE character
            SET name = $1, hair_color = $2, eye_color = $3, level = $4, position = $5, class_name = $6, species_name = $7, hp = $8
            WHERE character_id = $9
            RETURNING name
        `;

        const values = [name, hair_color, eye_color, level, position, class_name, species_name, hp, character_id];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
    }
});

export default router