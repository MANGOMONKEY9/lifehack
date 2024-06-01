const mysql = require("mysql2/promise");
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ["GET", "POST"]
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 *24 }
}));

async function connectDatabase () {
    try {
        db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "nicky44roxx",
            port: 3306,
            database: "lifehack2024"
        });
    } catch (err) {
        console.error("failed to connect to db", err);
        process.exit(1);
    }
}

connectDatabase();

app.post("/getData", async (req, res) => {
    const { username, password } = req.body; 
    console.log("Received login attempt with username:", username, "and password:", password);
    
    const query = `SELECT * FROM login_auth WHERE user_id = ? AND password = ?`;
    try {
        const [result] = await db.query(query, [username, password]);
        console.log("Database query result:", result);
        
        if (result.length > 0) {
            req.session.user = { username };
            res.json({ isAuthenticated: true });
        } else {
            res.json({ isAuthenticated: false });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
    console.log(req.session)
});


app.get('/checkAuth', async (req, res) => {
    console.log("Checking authentication");
    console.log("Session data:", req.session); // Debugging: log session data
    if (req.session && req.session.user) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

app.get("/getActivePatrols", async (req, res) => {
    const query = "SELECT* FROM active_patrols";
    try {
        const [result] = await db.query(query);
        res.json(result)
    } catch (err) {
        console.error(err);
    }
})

app.get("/getActiveThreats", async (req, res) => {
    const query = "SELECT * FROM locations";
    try {
        const [result] = await db.query(query)
        res.json(result)
    } catch (err) {
        console.error(err);
    }
})

app.get("/getReports", async (req, res) => {
    const query = "SELECT report, TIME(created_at) as created_time FROM incidents";
    try {
        const [result] = await db.query(query);
        res.json(result)
    } catch (err) {
        console.error(err)
    }
})

app.post("/startPatrol", async (req, res) => {
    const { location } = req.body;
    const query = `UPDATE active_patrols SET active_patrols = active_patrols + 1 WHERE location = ?`
    try {
        await db.query(query, [location]);
        res.sendStatus(200)
    } catch (err) {
        console.error("error starting patrol", err)
        res.sendStatus(500);
    }
});

app.post("/endPatrol", async (req, res) => {
    const { location } = req.body;
    const query = `UPDATE active_patrols SET active_patrols = active_patrols - 1 WHERE location = ?`
    try {
        await db.query(query, [location]);
        res.sendStatus(200)
    } catch (err) {
        console.error("error starting patrol", err)
        res.sendStatus(500);
    }
});

app.post("/submitReport", async (req, res) => {
    const { location, report } = req.body;
    const query = `INSERT INTO incidents (location, report) VALUES (?, ?)`;
    try {
        await db.query(query, [location, report]);
        res.sendStatus(200);
    } catch (err) {
        console.error("Error submitting incident", err);
        res.sendStatus(500);
    }
});

app.listen(4000, () => {
    console.log("Server started on port 4000")
});