import express from 'express';
import {getPool} from "../db.js";
import {selectAll} from "./index.js";

const router = express.Router();

router.get('/', async (req, res) => {
    await selectAll(req, res, 'species');
});

// INSERT
router.post('/', async (req, res) => {
    try {
        const {name, description, weight, height, type} = req.body;
        const pool = await getPool();

        const insertSpecies = await pool.query(
            "INSERT INTO species (name, description, weight, height, type)" +
            "VALUES ($1, $2, $3, $4, $5) RETURNING *", [name, description, weight, height, type]);

        res.status(200).json(insertSpecies.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// UPDATES with any number of custom values
router.put('/:name', async (req, res) => {
    try {
        const {name} = req.params;
        const {description, weight, height, type} = req.body;
        const pool = await getPool();

        const updateSpecies = await pool.query(
            "SELECT update_species($1, $2, $3, $4, $5)", [name, description, weight, height, type]);

        res.status(200).json(updateSpecies.rows[0].update_species);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// DELETE
router.delete('/:name', async (req, res) => {
    try {
        const {name} = req.params;
        const pool = await getPool();

        const deleteSpecies = await pool.query("DELETE FROM species WHERE name = $1 RETURNING *", [name]);

        res.status(200).json(deleteSpecies.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

export default router