// Express Server: Entry Point of system
const express = require('express');
const { getStatus, getStats } = require('./controllers/AppController')
const routes = require('./routes');

const dotenv = require('dotenv');
dotenv.config();

const PORT = 5000
const app = express();

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
