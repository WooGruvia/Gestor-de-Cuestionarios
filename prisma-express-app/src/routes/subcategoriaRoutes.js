const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');

router.get('/', subcategoriaController.subcategoria_list);
router.get('/:id', subcategoriaController.subcategoria_detail);
router.get('/categoria/:categoriaId', subcategoriaController.subcategoria_by_categoria);
router.post('/', subcategoriaController.subcategoria_create);
router.put('/:id', subcategoriaController.subcategoria_update);
router.delete('/:id', subcategoriaController.subcategoria_delete);

module.exports = router;