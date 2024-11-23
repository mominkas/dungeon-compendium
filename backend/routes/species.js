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
            "INSERT INTO species VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, description, weight, height, type]
        );

        res.status(200).json(insertSpecies.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});


// Projection: user can choose any number of attributes to view
router.post('/projection', async (req, res) => {
    try {
        const {attributes} = req.body;

        if (!Array.isArray(attributes) || attributes.length === 0) {
            throw new Error("Attributes must be non-empty array.");
        }

        const validAttrs = ["name", "description", "weight", "height", "type"];
        const selectedAttrs = attributes.filter(attr => validAttrs.includes(attr));

        if (selectedAttrs.length === 0) {
            throw new Error("No valid attributes selected.");
        }

        const query = `SELECT ${attributes.join(", ")} FROM species`;

        const pool = await getPool();
        const selectSpecies = await pool.query(query);

        res.status(200).json(selectSpecies.rows);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// Selection: user can search for tuples using AND/OR clauses and combination of attributes
router.post('/selection', async (req, res) => {
    try {
        const {conditions, clauses} = req.body;
        const pool = await getPool();

        if (conditions.length !== clauses.length + 1) {
            throw new Error("Need to specify an additional condition.");
        }

        const parts = [];

        conditions.forEach((cond, index) => {
            const {attr, op, val} = cond;
            if (attr === "weight") {
                if (op === "like") { throw new Error("Weight cannot use 'like' operator."); }
                if (isNaN(Number(val))) { throw new Error(`Weight cannot be compared to string '${val}'`); }
            }
            parts.push(`${attr} ${op} '${val}'`);
            parts.push(clauses[index]);
            index++;
        });

        const query = `SELECT * FROM species WHERE ${parts.join(" ")}`;
        console.log(query);
        const selectSpecies = await pool.query(query);
        res.status(200).json(selectSpecies.rows);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// UPDATE with any number of custom values
router.put('/:name', async (req, res) => {
    try {
        const {name} = req.params;
        const {description, weight, height, type} = req.body;
        const query = `
            UPDATE species
            SET
                description = COALESCE($2, description),
                weight = COALESCE($3, weight),
                height = COALESCE($4, height),
                type = COALESCE($5, type)
            WHERE name = $1
            RETURNING *;
        `;

        const pool = await getPool();
        const updateSpecies = await pool.query(query, [name, description, weight, height, type]);
        res.status(200).json(updateSpecies.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// DELETE
router.delete('/:name', async (req, res) => {
    try {
        const {name} = req.params;
        const pool = await getPool();

        const deleteSpecies = await pool.query(
            "DELETE FROM species WHERE name = $1 RETURNING *",
            [name]
        );

        res.status(200).json(deleteSpecies.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

export default router