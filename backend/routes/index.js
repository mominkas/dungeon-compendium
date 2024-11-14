import express from 'express';
import characterRouter from './character.js';
import campaignRouter from './campaign.js';
import classRouter from './class.js';
import classDescription from "./classDescription.js";
import classLevelFeatures from "./classLevelFeatures.js";
import {getPool} from "../db.js";
import species from "./species.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        msg: "IT WORKS!"
    })
})

// alphabetical
router.use('/campaign', campaignRouter);
router.use('/character', characterRouter);
router.use('/class', classRouter);
router.use('/class_description', classDescription);
router.use('/class_level_features', classLevelFeatures);
router.use('/species', species);

// generic endpoint handler function for SELECT *
async function selectAll(req, res, tableName) {
    try {
        const pool = await getPool();
        const query = `SELECT * FROM ${tableName}`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
    }
}

export {router, selectAll}