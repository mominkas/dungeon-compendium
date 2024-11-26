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

// Projection: user can choose any number of attributes to view
router.post('/', async (req, res) => {
    try {
        const {attributes} = req.body;

        if (!Array.isArray(attributes) || attributes.length === 0) {
            return res.status(200).json({message: "Attributes should be non-empty array"});
        }

        const validAttrs = ["name", "description", "primary_ability", "weapon_proficiency", "armor_proficiency", "hit_die", "saving_throw_proficiency"];
        const selectedAttrs = attributes.filter(attr => validAttrs.includes(attr));

        if (selectedAttrs.length === 0) {
            return res.status(400).json({error: "No valid attributes selected"});
        }

        const query = `SELECT ${attributes.join(", ")} FROM class_description`;
        const pool = await getPool();
        const selectClassDesc = await pool.query(query);

        res.status(200).json(selectClassDesc.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

export default router