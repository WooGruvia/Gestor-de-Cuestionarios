const express = require('express');
const router = express.Router();
const rangoEdadController = require('../controllers/rangoEdadController');

router.get('/', rangoEdadController.rangoedad_list);
router.get('/:id', rangoEdadController.rangoedad_detail);
router.post('/', rangoEdadController.rangoedad_create);
router.put('/:id', rangoEdadController.rangoedad_update);
router.delete('/:id', rangoEdadController.rangoedad_delete);

module.exports = router;