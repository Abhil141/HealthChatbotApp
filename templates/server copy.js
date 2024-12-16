import express from 'express';
import mysql from 'mysql2/promise'; // Use the promise-based API
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize the app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection using async/await
const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abhil@141', // Replace with your MySQL password
    database: 'medihelpdb',
});

console.log('Connected to MySQL database.');

// Get health data for a specific user (including caloriesDay and caloriesDate)
app.get('/health-data', async (req, res) => {
    const { username } = req.query;  // Fetch username from query params

    if (!username) {
        return res.status(400).send('Username is required');
    }

    const query = `
        SELECT 
            heartRateDay,
            heartRate,
            spO2Day,
            spO2,
            stepsDay,
            steps,
            sleepDay,
            sleepDuration,
            height,
            weight,
            bmi,
            calories,
            caloriesDay,
            caloriesDate
        FROM healthdata
        WHERE username = ?
    `;

    try {
        const [results] = await db.execute(query, [username]);
        res.json(results);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error fetching data.');
    }
});

// Endpoint to save health data for a specific user
app.post('/save-health-data', async (req, res) => {
    const data = req.body;

    // Ensure we have all required fields
    if (!data.username || !data.heartRate || !data.spO2 || !data.steps || !data.calories) {
        return res.status(400).send('Missing required fields.');
    }

    const query = `
        INSERT INTO healthdata 
        (username, heartRate, heartRateDate, heartRateDay, height, weight, bmi, spO2, spO2Date, spO2Day, steps, stepsDate, stepsDay, sleepDuration, sleepDate, sleepDay, calories, caloriesDay, caloriesDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

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
        data.caloriesDay,
        data.caloriesDate
    ];

    try {
        await db.execute(query, values);
        res.send('Health data saved successfully!');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error saving data.');
    }
});

// Endpoint to clear health data for a user
app.post('/clear-health-data', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).send('Username is required.');
    }

    const query = 'DELETE FROM healthdata WHERE username = ?';

    try {
        await db.execute(query, [username]);
        res.send('Health data cleared successfully!');
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error clearing data.');
    }
});

// Endpoint to delete data based on a specific date
app.post('/delete-data-by-date', async (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).send('Date is required.');
    }

    const query = `
        DELETE FROM healthdata
        WHERE heartRateDate = ? OR spO2Date = ? OR stepsDate = ? OR sleepDate = ?
    `;

    try {
        await db.execute(query, [date, date, date, date]);
        res.json({ message: `Data for date ${date} deleted successfully!` });
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ message: 'Error deleting data.' });
    }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));  // Assuming your static files are in the 'public' directory

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

