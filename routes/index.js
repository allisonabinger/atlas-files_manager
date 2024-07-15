// Router: Routes the endpoints to use the appropriate Controller method

const express = require('express');
const router = express.Router();
const { getStatus, getStats } = require('../controllers/AppController');
const UserController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

// DB and Redis Checks
router.get('/status', getStatus);
router.get('/stats', getStats);
router.post('/users', UserController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/user/me', UserController.getMe);

module.exports = router;
