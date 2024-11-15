import express from 'express';
import {getPool} from "../db.js";
import {selectAll} from "./index.js";

const router = express.Router();

router.get('/', async (req, res) => {
    await selectAll(req, res, 'class_description')
});

// INSERT
router.post('/', async (req, res) => {
    try {
        const {name, description, primary_ability, weapon_proficiency, armor_proficiency, hit_die, saving_throw_proficiency} =
            req.body;
        const pool = await getPool();

        const insertClassDescription = await pool.query(
            "INSERT INTO class_description (name, description, primary_ability, weapon_proficiency, armor_proficiency, hit_die, saving_throw_proficiency)" +
            "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [
                name,
                description,
                primary_ability,
                weapon_proficiency,
                armor_proficiency,
                hit_die,
                saving_throw_proficiency
            ]);

        res.status(200).json(insertClassDescription.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

// UPDATES with any number of custom values
router.put('/:name', async (req, res) => {
       try {
        const {name} = req.params;
        const {description, primary_ability, weapon_proficiency, armor_proficiency, hit_die, saving_throw_proficiency} = req.body;
        const pool = await getPool();

        const updateDesc = await pool.query(
            "SELECT update_class_description($1, $2, $3, $4, $5, $6, $7)", [
            name,
            description,
            primary_ability,
            weapon_proficiency,
            armor_proficiency,
            hit_die,
            saving_throw_proficiency
        ]);

        res.status(200).json(updateDesc.rows[0].update_class_description);
    } catch (err) {
       res.status(400).json(err.message);
    }
});

// DELETE
router.delete('/:name', async (req, res) => {
    try {
        const {name} = req.params;
        const pool = await getPool();

        const deleteClassDesc = await pool.query("DELETE FROM class_description WHERE name = $1 RETURNING *", [name]);

        res.status(200).json(deleteClassDesc.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

export default router