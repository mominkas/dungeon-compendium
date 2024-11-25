import express from 'express';
import {getPool} from "../db.js";
import {selectAll} from "./index.js";

const router = express.Router();

router.get('/', async (req, res) => {
    await selectAll(req, res, 'species');
});

// Selection: user can search for tuples using AND/OR clauses and combination of attributes
router.post('/', async (req, res) => {
    try {
        const {conditions, clauses} = req.body;

        if (!Array.isArray(conditions) || conditions.length === 0 || !Array.isArray(clauses) || clauses.length === 0) {
            return res.status(400).json({message: "Conditions and clauses should be non-empty arrays"});
        }

        const errors = validateErrors({conditions, clauses});
        if (errors.length > 0) {
            return res.status(400).json({error: errors.join(". ")});
        }

        const parts = [];
        conditions.forEach((cond, index) => {
            const {attr, op, val} = cond;

            (cond.attr === "weight" || cond.attr === "height")
                ? parts.push(`${attr} ${op} ${val}`)
                : parts.push(`${attr} ${op} '${val}'`);
            parts.push(clauses[index].val);
            index++;
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

const validateErrors = ({conditions, clauses}) => {
    const errors = [];

    for (const cond of conditions) {
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
    }

    if (clauses.length !== conditions.length) {
        errors.push("Incorrect number of clauses");
    }
    for (let i = 0; i < clauses.length; i++) {
       const clause = clauses[i];
        if (i === clauses.length - 1) {
            if (clause.val) {
                errors.push("Cannot end with a clause")
            }
        } else {
            if (!clause.val || clause.val.trim() === "") {
                errors.push("Missing clause");
            }
        }
    }

   return errors;
}

export default router