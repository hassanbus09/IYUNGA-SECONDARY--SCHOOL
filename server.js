require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); 

const app = express();
const PORT = 3000; 

// 1. Middlewares - Muhimu ili server isome vizuri data kutoka kwenye fomu ya HTML
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// 2. Configuration ya Database
const pool = new Pool({
user: 'postgres',
host: 'localhost',
database: 'iyunga_sms_db',
password: '@hassan',
port: 5432,
}); 

// Jaribu muunganisho mara tu server inapowaka
pool.connect((err, client, release) => {
if (err) {
return console.error('❌ DATABASE CONNECTION ERROR:', err.stack);
}
console.log('🟢 DATABASE CONNECTED: Server successfully linked to PostgreSQL.');
release();
}); 

// ============================================================
// ROUTES (API Endpoints)
// ============================================================ 

// 1. POST: Tuma taarifa za mwanafunzi kwenda PostgreSQL
app.post('/api/students', async (req, res) => {
const { reg_no, full_name, gender, class_level, phone_number, email_address } = req.body; 

// Ulinzi: Zuia data tupu zisizoweza kuingia kwenye database
if (!reg_no || !full_name) {
return res.status(400).json({ success: false, error: "Reg No and Full Name are mandatory!" });
}

try {
// Amri ya SQL: Inaingiza data kwenye table ya students
const queryText = 'INSERT INTO students (reg_no, full_name, gender, class_level, phone_number, email_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
const values = [reg_no, full_name, gender, class_level, phone_number, email_address];
const result = await pool.query(queryText, values);

console.log(`✅ Data Added: ${result.rowCount} row(s) affected.`); 

// ======================================================================
// 🟢 REKEBISHO: Anuani ya kurudi imekamilishwa sasa ili kuondoa mizinguo
// ======================================================================
res.send(`
`);
// ======================================================================

} catch (err) {
console.error('❌ SQL ERROR:', err.message);
res.status(500).json({ success: false, error: err.message });
}

}); 

// 2. GET: Vuta taarifa zote kutoka PostgreSQL
app.get('/api/students', async (req, res) => {
try {
const result = await pool.query('SELECT * FROM students ORDER BY reg_no ASC');
res.json(result.rows);
} catch (err) {
console.error('❌ FETCH ERROR:', err.message);
res.status(500).json({ error: err.message });
}
}); 

// 3. Washa Server
app.listen(PORT, '0.0.0.0', () => {
console.log(================================================================);
console.log(🚀 SERVER RUNNING: http://localhost:${PORT});
console.log(================================================================);
});