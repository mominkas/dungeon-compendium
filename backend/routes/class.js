import express from 'express';
import {getPool} from "../db.js";
import {FK_VIOLATION_CODE, PK_DUPLICATE_CODE} from "./index.js";

const router = express.Router();

// route setups: https://www.youtube.com/watch?v=ldYcgPKEZC8&t=930s&ab_channel=freeCodeCamp.org
router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const query = `SELECT * FROM class ORDER BY name, level`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.get('/classyCharacters', async (req, res) => {
    try {
        const query =
        `SELECT p.participant_id, p.name AS name, AVG(c.level) AS avg
        FROM participant p
        JOIN character c ON p.participant_id = c.participant_id
        GROUP BY p.participant_id, p.name
        HAVING AVG(c.level) > 2
        ORDER BY avg DESC;`

        const pool = await getPool();
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// used by characters to get HP
router.get('/options', async (req, res) => {
    try {
        const pool = await getPool();
        const query = `SELECT name, level FROM class ORDER BY name, level`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// INSERT
router.post('/', async (req, res) => {
    try {
        const {name, level} = req.body;

        if (!name || !level) {
            return res.status(400).json({error: "No name or level provided"});
        }
        if (name.trim() === "") {
            return res.status(400).json({error: "Name must be a valid string"});
        }
        if (isNaN(Number(level)) || level.trim() === "") {
            return res.status(400).json({error: "Level must be a valid number"});
        }

        const pool = await getPool();
        const insertClass = await pool.query(
            "INSERT INTO class (name, level) VALUES ($1, $2) RETURNING *",
            [name, level]
        );

        res.status(200).json(insertClass.rows[0]);
    } catch (err) {
        console.log(err.code);
        if (Number(err.code) === PK_DUPLICATE_CODE) {
            res.status(400).json({error: "A class with this name and level already exists"})
        } else if (Number(err.code) === FK_VIOLATION_CODE) {
            res.status(400).json({error: "This class name or level does not exist"})
        } else {
            res.status(400).json({error: err.message});
        }
    }
});

export default router