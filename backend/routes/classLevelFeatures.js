import express from 'express';
import {getPool} from "../db.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const query = `SELECT * FROM class_level_features ORDER BY level`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// INSERT
router.post('/', async (req, res) => {
    try {
        const {level, num_hit_die, advantage_effect,modifier_effect} = req.body;
        const pool = await getPool();

        const insertClassLevelFeatures = await pool.query(
            "INSERT INTO class_level_features VALUES ($1, $2, $3, $4) RETURNING *",
            [level, num_hit_die, advantage_effect, modifier_effect]
        );

        res.status(200).json(insertClassLevelFeatures.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// UPDATE with any number of custom values
router.put('/:level', async (req, res) => {
    try {
        const {level} = req.params;
        const {num_hit_die, advantage_effect, modifier_effect} = req.body;
        const query = `
            UPDATE class_level_features
            SET
                num_hit_die = COALESCE($2, num_hit_die),
                advantage_effect = COALESCE($3, advantage_effect),
                modifier_effect = COALESCE($4, modifier_effect)
            WHERE level = $1
            RETURNING *;
        `;

        const pool = await getPool();
        const updateFeatures = await pool.query(query, [level, num_hit_die, advantage_effect, modifier_effect]);
        res.status(200).json(updateFeatures.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// DELETE will cascade
router.delete('/:level', async (req, res) => {
    try {
        const {level} = req.params;
        const pool = await getPool();

        const deleteClassLevelFeatures = await pool.query(
            "DELETE FROM class_level_features WHERE level = $1 RETURNING *",
            [level]
        );

        res.status(200).json(deleteClassLevelFeatures.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

export default router