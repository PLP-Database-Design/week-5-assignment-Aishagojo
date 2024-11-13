
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Configure the database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test the database connection
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Simple test route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Retrieve all patients
app.get('/patients', (req, res) => {
  console.log('GET /patients endpoint was hit');
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Query results:', results);
    res.json(results);
  });
});

// Retrieve all providers
app.get('/providers', (req, res) => {
  console.log('GET /providers endpoint was hit');
  const query = 'SELECT first_name, last_name, provider_speciality FROM providers'; // Updated column name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Query results:', results);
    res.json(results);
  });
});

// Filter patients by First Name
app.get('/patients/:firstName', (req, res) => {
  console.log(`GET /patients/${req.params.firstName} endpoint was hit`);
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(query, [req.params.firstName], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Query results:', results);
    res.json(results);
  });
});

// Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  console.log(`GET /providers/specialty/${req.params.specialty} endpoint was hit`);
  const query = 'SELECT first_name, last_name, provider_speciality FROM providers WHERE provider_speciality = ?'; // Updated column name
  db.query(query, [req.params.specialty], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('Query results:', results);
    res.json(results);
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
