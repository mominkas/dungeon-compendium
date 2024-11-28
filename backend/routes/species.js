import express from 'express';
import {getPool} from "../db.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const pool = await getPool();
        const query = `SELECT * FROM species ORDER BY name`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

router.get('/popularSpecies', async (req, res) => {
    try {
        const query =
            `SELECT s.name AS name, COUNT(*) AS count
            FROM character c
            JOIN species s ON c.species_name = s.name
            GROUP BY s.name
            ORDER BY count DESC;`

        const pool = await getPool();
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// Selection: user can search for tuples using AND/OR clauses and combination of attributes
router.post('/', async (req, res) => {
    try {
        const {conditions} = req.body;

        if (!Array.isArray(conditions) || conditions.length === 0) {
            return res.status(400).json({message: "Conditions should be a non-empty array"});
        }

        const errors = validateErrors(conditions);
        if (errors.length > 0) {
            return res.status(400).json({error: errors.join(". ")});
        }

        const parts = [];
        conditions.forEach((cond) => {
            let {attr, op, val, clause} = cond;

            switch(op) {
                case "does not equal":
                    op = "<>";
                    break;
                case "contains":
                    op = "like";
                    val = `%${val}%`;
                    break;
                case "is":
                    op = "like";
                    break;
            }

            (cond.attr === "weight" || cond.attr === "height")
                ? parts.push(`${attr} ${op} ${val} ${clause}`)
                : parts.push(`${attr} ${op} '${val}' ${clause}`);
        });

        const pool = await getPool();
        const query = `SELECT * FROM species WHERE ${parts.join(" ")}`;
        console.log(query);
        const selectSpecies = await pool.query(query);
        res.status(200).json(selectSpecies.rows);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

const validateErrors = (conditions) => {
    const errors = [];

    for (let i = 0; i < conditions.length; i++) {
        const cond = conditions[i];

        if (!cond.attr || cond.attr.trim() === "") {
            errors.push("Missing attribute");
        }
        if (!cond.op || cond.op.trim() === "") {
            errors.push("Missing operator");
        }
        if (cond.attr === "weight" || cond.attr === "height") {
            if (isNaN(Number(cond.val)) || cond.val.trim() === "") {
                errors.push(`${cond.attr} must be a number`);
            }
        }
        if (i === conditions.length - 1) {
            if (cond.clause) {
                errors.push("Cannot end with a clause")
            }
        } else {
            if (!cond.clause || cond.clause.trim() === "") {
                errors.push("Missing clause");
            }
        }
    }

   return errors;
}

export default router