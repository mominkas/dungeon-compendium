import express from 'express';
import {getPool} from "../db.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const query = `SELECT * FROM class ORDER BY name, level`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// INSERT
router.post('/', async (req, res) => {
    try {
        const {name, level} = req.body;

        if (!name || !level) {
            return res.status(400).json({ error: "No name or level provided" });
        }

        const pool = await getPool();
        const insertClass = await pool.query(
            "INSERT INTO class (name, level) VALUES ($1, $2) RETURNING *",
            [name, level]
        );

        res.status(200).json(insertClass.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// DELETE
router.delete('/:name/:level', async (req, res) => {
    try {
        const {name, level} = req.params;
        const pool = await getPool();

        const deleteClass = await pool.query(
            "DELETE FROM class WHERE name = $1 AND level = $2 RETURNING *",
            [name, level]
        );

        res.status(200).json(deleteClass.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

export default router