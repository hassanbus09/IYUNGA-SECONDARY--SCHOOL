const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // 🟢 Tumeongeza kiunganishi cha PostgreSQL hapa

const app = express();
const PORT = 8080; 

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const pool = new Pool({
    user: 'postgres',           
    host: 'localhost',
    database: 'iyunga_sms_db',  
    password: '@hassan',  
    port: 5432,                 
});

// Jaribu muunganisho wa Database (Database Connection Test)
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error acquiring client:', err.stack);
    }
    console.log('🟢 Connected to the PostgreSQL database successfully.');
    release();
});



// Njia ya kwanza (Test Route)
app.get('/', (req, res) => {
    res.send('<h1>Iyunga SMS Backend Server is Running & Connected to PostgreSQL!</h1>');
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`================================================================`);
    console.log(`🚀 Server imewaka vizuri na imeunganishwa kwenye Database!`);
    console.log(`👉 Backend URL: http://localhost:${PORT}`);
    console.log(`================================================================`);
});
