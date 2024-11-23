import express from 'express';
import {getPool} from "../db.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const query = `SELECT * FROM class_description ORDER BY name`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// INSERT
router.post('/', async (req, res) => {
    try {
        const {name, description, primary_ability, weapon_proficiency, armor_proficiency, hit_die, saving_throw_proficiency} =
            req.body;
        const pool = await getPool();

        const insertClassDescription = await pool.query(
            "INSERT INTO class_description VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [
                name,
                description,
                primary_ability,
                weapon_proficiency,
                armor_proficiency,
                hit_die,
                saving_throw_proficiency
            ]
        );

        res.status(200).json(insertClassDescription.rows[0]);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// UPDATE with any number of custom values
router.put('/:name', async (req, res) => {
    try {
        const {name} = req.params;
        const {description, primary_ability, weapon_proficiency, armor_proficiency, hit_die, saving_throw_proficiency} = req.body;
        const query = `
            UPDATE class_description
            SET
                description = COALESCE($2, description),
                primary_ability = COALESCE($3, primary_ability),
                weapon_proficiency = COALESCE($4, weapon_proficiency),
                armor_proficiency = COALESCE($5, armor_proficiency),
                hit_die = COALESCE($6, hit_die),
                saving_throw_proficiency = COALESCE($7, saving_throw_proficiency)
            WHERE name = $1
            RETURNING *;
        `;

        const pool = await getPool();
        const updateDesc = await pool.query(query,
            [name, description, primary_ability, weapon_proficiency, armor_proficiency, hit_die, saving_throw_proficiency]
        );
        res.status(200).json(updateDesc.rows[0]);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// DELETE will cascade
router.delete('/:name', async (req, res) => {
    try {
        const {name} = req.params;
        const pool = await getPool();

        const deleteClassDesc = await pool.query(
            "DELETE FROM class_description WHERE name = $1 RETURNING *",
            [name]
        );

        res.status(200).json(deleteClassDesc.rows[0]);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

export default router