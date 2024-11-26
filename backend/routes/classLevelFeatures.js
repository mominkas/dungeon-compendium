import express from 'express';
import {getPool} from "../db.js";
import {PK_DUPLICATE_CODE} from "./index.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const query = `SELECT * FROM class_level_features ORDER BY level`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// INSERT
router.post('/', async (req, res) => {
    try {
        const {level, num_hit_die, advantage_effect, modifier_effect} = req.body;

        const errors = validateErrors({level, num_hit_die, advantage_effect, modifier_effect});
        if (errors.length > 0) {
            return res.status(400).json({error: errors.join(". ")});
        }

        const pool = await getPool();
        const insertClassLevelFeatures = await pool.query(
            "INSERT INTO class_level_features VALUES ($1, $2, $3, $4) RETURNING *",
            [level, num_hit_die, advantage_effect, modifier_effect]
        );

        res.status(200).json(insertClassLevelFeatures.rows[0]);
    } catch (err) {
        if (Number(err.code) === PK_DUPLICATE_CODE) {
            res.status(400).json({error: "This level already exists"});
        } else {
            res.status(400).json({error: err.message});
        }
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
        res.status(400).json({error: err.message});
    }
});

const validateErrors = (features) => {
    const errors = [];

    for (const [key, value] of Object.entries(features)) {
        if (!value) {
            errors.push(`No ${key} provided`);
        } else if (isNaN(Number(value)) || value.trim() === "") {
            errors.push(`${key} must be a valid number`);
        }
    }

    return errors;
}

export default router