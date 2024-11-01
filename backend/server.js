const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db')

app.use(cors());
app.use(express.json());

// TEST ROUTE REMOVE LATER
app.post("/test", async(req, res) => {
    try {
        const { name } = req.body;
        const addTest = await pool.query("INSERT INTO test (name) VALUES($1)", [name]);

        res.json(addTest)
    } catch (error) {
        console.log(error)
    }
})

app.listen(5001, () => {
    console.log("server on port 5001");
});