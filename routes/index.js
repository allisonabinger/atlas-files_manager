// Router: Routes the endpoints to use the appropriate Controller method

const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const UserController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

// DB and Redis Checks
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UserController.postNew);
// router.post('/users', (req, res) => {
//     res.json({ message: 'User creatino endpoint is working' })
// })
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UserController.getMe);
router.post('/files', FilesController.postUpload);

module.exports = router;
