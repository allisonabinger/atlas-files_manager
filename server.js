const express = require('express');
const routes = require('./routes');

const dotenv = require('dotenv');
dotenv.config();

const PORT = 5000;
const app = express();

app.use(express.json());
app.use('/', routes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
