const express = require('express');
const swisseph = require('swisseph');
const path = require('path');

const app = express();
app.use(express.json());

// Path to ephemeris files
swisseph.swe_set_ephe_path(path.join(__dirname, 'ephe'));

// Endpoint to calculate planetary data
app.post('/calculate', (req, res) => {
    const { jd, planet, flags } = req.body;
    swisseph.swe_calc_ut(jd, planet, flags, (result) => {
        if (result.rc < 0) return res.status(400).send(result);
        res.send(result);
    });
});

app.listen(3000, () => {
    console.log('Swiss Ephemeris API running on port 3000');
});
