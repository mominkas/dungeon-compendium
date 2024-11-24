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
        const pool = await getPool();

        if (conditions.length !== clauses.length + 1) {
            return res.status(400).json({error: "Need to specify an additional condition"});
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
        res.status(400).json({error: err.message});
    }
});

export default router