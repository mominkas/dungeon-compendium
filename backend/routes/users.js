import express from 'express';
import bcrypt from 'bcrypt';
import {getPool} from '../db.js'


const router = express.Router();

router.get('/all/:id', async (req,res) => {
    const { id } = query.params;
    try {
        const pool = await getPool()
        const query = `
        SELECT * FROM participant p
        WHERE p.participant_id != $1`
        const result = await pool.query(query)
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(400).json({error: "Could not get list of users " + error})
    }
})

router.get('/allClassesPlayers', async (req,res) => {
    try {
        const pool = await getPool();
        const query = `
            SELECT p.name, p.location,g p.experience_level
            FROM Participant p
            WHERE NOT EXISTS (
                (   SELECT c.name
                    FROM class c)
                    EXCEPT (SELECT c2.name
                            FROM character char
                            JOIN class c2 ON char.class_name = c2.name
                            WHERE char.participant_id = p.participant_id)
            )
        `

        const result = await pool.query(query);
        res.status(200).json(result.rows);

    } catch (err) {
        res.status(400).json({error: err.message});
    }
})


router.post('/signup', async (req,res) => {
    try {
        const db = await getPool();
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({error: "Please enter name and password"})
        }

        const isUserPresent = await db.query(
            'SELECT name FROM Participant WHERE name = $1',
            [name]
        )

        if (isUserPresent.rows.length > 0) {
            return res.status(400).json({error: "username already exists, please choose a different user name!"})
        }

        const salts = 10;
        const hashedPw = await bcrypt.hash(password, salts);

        const userInserted = await db.query(
            'INSERT INTO Participant (name, password) VALUES ($1, $2) RETURNING participant_id, name',
            [name, hashedPw]
        )

        res.status(201).json({
            msg: "user added successfully",
            user: {
                name: userInserted.rows[0].name,
                id: userInserted.rows[0].participant_id
            }
        })

    } catch (error) {
        console.error('Error while registering new user:', error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post('/login', async (req, res) => {
    try {
        const db = await getPool();
        const { name, password } = req.body;
    
        if (!name || !password) {
            return res.status(400).json({error: "Please enter name and password"})
        }

        const getUser = await db.query(
            'SELECT * FROM Participant WHERE name = $1',
            [name]
        )
    
        const user = getUser.rows[0];
    
        if (!user) {
            return res.status(401).json({error: "Invalid Creds"})
        }

        const checkPW = await bcrypt.compare(password, user.password)
    
        if (!checkPW && password != user.password) {
            return res.status(401).json({error: "Invalid Creds"})
        }
    
        res.status(200).json({
            msg: "Successful Login",
            user: {
                id: user.participant_id,
                name: user.name
            }
        })
    } catch (error) {
        console.error('Error while logging in:', error);
        res.status(500).json({ error: "Internal server error" });
    }
})

export default router