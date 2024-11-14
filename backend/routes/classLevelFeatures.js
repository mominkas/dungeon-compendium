import express from 'express';
import {getPool} from "../db.js";
import {selectAll} from "./index.js";

const router = express.Router();

router.get('/', async (req, res) => {
    await selectAll(req, res, 'class_level_features');
});

// INSERT
router.post('/', async (req, res) => {
    try {
        const {level, num_hit_die, advantage_effect,modifier_effect} = req.body;
        const pool = await getPool();

        const insertClassLevelFeatures = await pool.query(
            "INSERT INTO class_level_features (level, num_hit_die, advantage_effect, modifier_effect)" +
            "VALUES ($1, $2, $3, $4) RETURNING *", [level, num_hit_die, advantage_effect, modifier_effect]);

        res.json(insertClassLevelFeatures.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// UPDATES with any number of custom values
router.put('/:level', async (req, res) => {
    try {
        const {level} = req.params;
        const {num_hit_die, advantage_effect, modifier_effect} = req.body;
        const pool = await getPool();

        const updateFeatures = await pool.query(
            "SELECT update_class_level_features($1, $2, $3, $4)", [level, num_hit_die, advantage_effect, modifier_effect]);

        res.json(updateFeatures.rows[0].update_class_level_features);
    } catch (err) {
        console.error(err.message);
    }
});

// DELETE
router.delete('/:level', async (req, res) => {
    try {
        const {level} = req.params;
        const pool = await getPool();

        const deleteClassLevelFeatures = await pool.query("DELETE FROM class_level_features WHERE level = $1 RETURNING *", [level]);

        res.json(deleteClassLevelFeatures.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

export default router