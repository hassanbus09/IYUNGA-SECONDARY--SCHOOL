const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080; // 🟢 REKEBISHO: Tumehama kutoka 5000 kwenda 8080 ili kukwepa ulinzi wa firewall

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Njia ya kwanza (Test Route)
app.get('/', (req, res) => {
    res.send('<h1>Iyunga SMS Backend Server is Running!</h1>');
});

// Weka '0.0.0.0' ili kuruhusu firewall ipitishe data bila vikwazo vyovyote
app.listen(PORT, '0.0.0.0', () => {
    console.log(`================================================================`);
    console.log(`🚀 Server imewaka vizuri! Fungua kwenye browser njia hizi mbili:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`👉 http://127.0.0.1:${PORT}`);
    console.log(`================================================================`);
});
