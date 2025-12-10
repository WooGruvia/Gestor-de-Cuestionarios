const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/profile', verifyToken, userController.getProfile);
router.get('/', verifyToken, authorizeRoles('ADMIN'), userController.getAllUsers);
router.get('/:id', verifyToken, authorizeRoles('ADMIN'), userController.getUserById);
router.put('/:id', verifyToken, authorizeRoles('ADMIN'), userController.updateUser);
router.delete('/:id', verifyToken, authorizeRoles('ADMIN'), userController.deleteUser);

module.exports = router;