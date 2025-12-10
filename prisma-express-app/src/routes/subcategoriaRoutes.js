const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, subcategoriaController.subcategoria_list);
router.get('/:id', verifyToken, subcategoriaController.subcategoria_detail);
router.get('/categoria/:categoriaId', verifyToken, subcategoriaController.subcategoria_by_categoria);
router.post('/', verifyToken, authorizeRoles('ADMIN'), subcategoriaController.subcategoria_create);
router.put('/:id', verifyToken, authorizeRoles('ADMIN'), subcategoriaController.subcategoria_update);
router.delete('/:id', verifyToken, authorizeRoles('ADMIN'), subcategoriaController.subcategoria_delete);

module.exports = router;