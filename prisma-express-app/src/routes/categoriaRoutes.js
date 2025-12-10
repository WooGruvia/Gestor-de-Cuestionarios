const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, categoriaController.categoria_list);
router.get('/:id', verifyToken, categoriaController.categoria_detail);
router.post('/', verifyToken, authorizeRoles('ADMIN'), categoriaController.categoria_create);
router.put('/:id', verifyToken, authorizeRoles('ADMIN'), categoriaController.categoria_update);
router.delete('/:id', verifyToken, authorizeRoles('ADMIN'), categoriaController.categoria_delete);

module.exports = router;