require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path'); // Import path module
const app = express();

// Use express.json() to parse incoming JSON requests
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Define a GET route for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

// Mentor matching endpoint
app.post('/mentor-match', (req, res) => {
  const { student_id, subject } = req.body;

  if (!student_id || !subject) {
    return res.status(400).send('Student ID and subject are required');
  }

  const query = `SELECT * FROM mentors WHERE subject = ?`;
  connection.query(query, [subject], (err, results) => {
    if (err) {
      return res.status(500).send('Error finding mentor');
    }
    if (results.length === 0) {
      return res.status(404).send('No mentor found for the specified subject');
    }
    res.status(200).json(results);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
