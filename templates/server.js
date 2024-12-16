import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize the app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection (Using dynamic import for MySQL)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abhil@141', // Replace with your MySQL password
    database: 'medihelpdb'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

app.get('/health-data', (req, res) => {
    // Query the database to retrieve health data
    const query = `
        SELECT 
            heartRateDay,          -- Day for heart rate data
            heartRate,             -- Heart rate value
            spO2Day,               -- Day for SpO2 data
            spO2,                  -- SpO2 level
            stepsDay,              -- Day for steps count
            steps,                 -- Steps count
            sleepDay,              -- Day for sleep data
            sleepDuration,         -- Sleep duration
            height,                -- Height data
            weight,                -- Weight data
            bmi,                   -- BMI data
            caloriesDay,           -- caloriesDay
            calories               -- calories burnt
        FROM healthdata
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error fetching data.');
        }

        // Send the query results directly as JSON response
        res.json(results);
    });
});



// Endpoint to save health data (for edit-dashboard functionality)
app.post('/save-health-data', (req, res) => {
    const data = req.body;

    const query = `INSERT INTO healthdata (username, heartRate, heartRateDate, heartRateDay, height, weight, bmi, spO2, spO2Date, spO2Day, steps, stepsDate, stepsDay, sleepDuration, sleepDate, sleepDay, calories, caloriesDate, caloriesDay)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
        data.sleepDay,
        data.calories,
        data.caloriesDate,
        data.caloriesDay
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
    const { username } = req.body;

    const query = 'DELETE FROM healthdata WHERE username = ?';

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

    const query = `DELETE FROM healthdata WHERE heartRateDate = ? OR spO2Date = ? OR stepsDate = ? OR sleepDate = ? OR  caloriesDate = ?`;

    db.query(query, [date, date, date, date, date], (err, result) => {
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


