import express from 'express';
import characterRouter from './character.js';
import campaignRouter from './campaign.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        msg: "IT WORKS!"
    })
})

router.use('/character', characterRouter);
router.use('/campaign', campaignRouter);

export default router