import express from 'express';
import characterRouter from './character.js';
import campaignRouter from './campaign.js';
import classRouter from './class.js';
import classDescription from "./classDescription.js";
import classLevelFeatures from "./classLevelFeatures.js";
import {getPool} from "../db.js";
import species from "./species.js";
import userRouter from './users.js';

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
router.use('/users', userRouter);

// generic endpoint handler function for SELECT * with no order
async function selectAll(req, res, tableName) {
    try {
        const pool = await getPool();
        const query = `SELECT * FROM ${tableName}`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).json(err.message);
    }
}

// common postgres violation codes
const PK_DUPLICATE_CODE = 23505;
const FK_VIOLATION_CODE = 23503;

export {router, selectAll, PK_DUPLICATE_CODE, FK_VIOLATION_CODE}