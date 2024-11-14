import express from 'express';
import characterRouter from './character.js';
import campaignRouter from './campaign.js';
import userRouter from './users.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        msg: "IT WORKS!"
    })
})

router.use('/character', characterRouter);
router.use('/campaign', campaignRouter);
router.use('/users', userRouter);

export default router