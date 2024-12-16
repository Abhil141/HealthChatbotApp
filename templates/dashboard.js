import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',    // Your MySQL host
    user: 'root',         // Your MySQL username
    password: 'Abhil@141', // Your MySQL password
    database: 'medihelpdb' // Your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Connected to the database.');
});

// API endpoint to fetch health data
app.get('/health-data', (req, res) => {
    db.query('SELECT * FROM healthdata', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error fetching data.');
            return;
        }
        res.json(results); // Sending the results as JSON to the client
    });
});

// API endpoint to save health data
app.post('/save-health-data', (req, res) => {
    const data = req.body;

    const query = `INSERT INTO healthdata (username, heartRate, heartRateDate, heartRateDay, height, weight, bmi, spO2, spO2Date, spO2Day, steps, stepsDate, stepsDay, sleepDuration, sleepDate, sleepDay)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        data.username,
        data.heartRate,
        data.heartRateDate,
        data.heartRateDay,
        data.height,
        data.weight,
        data.bmi,
        data.spO2,
        data.spO2Date,
        data.spO2Day,
        data.steps,
        data.stepsDate,
        data.stepsDay,
        data.sleepDuration,
        data.sleepDate,
        data.sleepDay
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error saving data.');
        } else {
            res.send('Health data saved successfully!');
        }
    });
});

// Endpoint to Clear Health Data for a User
app.post('/clear-health-data', (req, res) => {
    const { username } = req.body;  // Assuming you send the username in the request body

    const query = 'DELETE FROM HealthData WHERE username = ?';
    
    db.query(query, [username], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).send('Error clearing data.');
        } else {
            res.send('Health data cleared successfully!');
        }
    });
});

// Endpoint to delete data based on date
app.post('/delete-data-by-date', (req, res) => {
    const { date } = req.body;

    const query = `DELETE FROM HealthData WHERE heartRateDate = ? OR spO2Date = ? OR stepsDate = ? OR sleepDate = ?`;

    db.query(query, [date, date, date, date], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json({ message: 'Error deleting data.' });
        } else {
            res.json({ message: `Data for date ${date} deleted successfully!` });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

