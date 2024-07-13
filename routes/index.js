// Router: Routes the endpoints to use the appropriate Controller method

const express = require('express');
const router = express.Router();
const { getStatus, getStats } = require('../controllers/AppController');

// DB and Redis Checks
router.get('/status', getStatus);
router.get('/stats', getStats);

module.exports = router;
