const express = require('express');
const router = express.Router();
const rangoEdadController = require('../controllers/rangoEdadController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, rangoEdadController.rangoedad_list);
router.get('/:id', verifyToken, rangoEdadController.rangoedad_detail);
router.post('/', verifyToken, authorizeRoles('ADMIN'), rangoEdadController.rangoedad_create);
router.put('/:id', verifyToken, authorizeRoles('ADMIN'), rangoEdadController.rangoedad_update);
router.delete('/:id', verifyToken, authorizeRoles('ADMIN'), rangoEdadController.rangoedad_delete);

module.exports = router;