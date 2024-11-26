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

router.post('/', async (req, res) => {
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
        const partipant_id = 1;

        if (!name || !class_name || !level || !species_name) {
            return res.status(400).json({error: "Missing a required field"});
        }

        const hitDieQuery = 'SELECT hit_die FROM class WHERE name = $1 LIMIT 1'
        const hitDieResult = await pool.query(hitDieQuery, [class_name]);

        let hp;
        if (rollForHP) {
            hp = 0;
            for (let i = 0; i < level; i++) {
                const roll = Math.floor(Math.random() * hitDie) + 1;
                hp += roll;
            }
        } else {
            hp = parseInt(hitPointsCustom);
        }


        const query = `
            INSERT INTO character
            (name, hair_color, eye_color, level, position, class_name, species_name, hp, participant_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1) 
            RETURNING *
        `;

        const values = [name, hair_color, eye_color, level, position, class_name, species_name, hp];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
    }
}

export default router