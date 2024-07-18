// Router: Routes the endpoints to use the appropriate Controller method

const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

// DB and Redis Checks
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Creates a new User
router.post('/users', UserController.postNew);
// router.post('/users', (req, res) => {
//     res.json({ message: 'User creatino endpoint is working' })
// })

// Gets Authentication token for 24 Hours
router.get('/connect', AuthController.getConnect);
// Removes Authentication token
router.get('/disconnect', AuthController.getDisconnect);

// Gets id and email for user
router.get('/users/me', UserController.getMe);

// Post and Get new File information based on file id or parent id
router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

// update public attribute for files
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

// retrieves the data from a specific file
router.get('/files/:id/data', FilesController.getFile)
module.exports = router;
