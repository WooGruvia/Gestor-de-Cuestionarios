const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/', categoriaController.categoria_list);
router.get('/:id', categoriaController.categoria_detail);
router.post('/', categoriaController.categoria_create);
router.put('/:id', categoriaController.categoria_update);
router.delete('/:id', categoriaController.categoria_delete);

module.exports = router;