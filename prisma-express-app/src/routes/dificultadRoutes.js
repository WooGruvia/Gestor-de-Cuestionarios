const express = require('express');
const router = express.Router();
const dificultadController = require('../controllers/dificultadController');

router.get('/', dificultadController.dificultad_list);
router.get('/:id', dificultadController.dificultad_detail);
router.get('/rango-edad/:rangoEdadId', dificultadController.dificultad_by_rangoedad);
router.post('/', dificultadController.dificultad_create);
router.put('/:id', dificultadController.dificultad_update);
router.delete('/:id', dificultadController.dificultad_delete);

module.exports = router;