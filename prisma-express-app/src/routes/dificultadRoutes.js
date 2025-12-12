const express = require('express');
const router = express.Router();
const dificultadController = require('../controllers/dificultadController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, dificultadController.dificultad_list);
router.get('/:id', verifyToken, dificultadController.dificultad_detail);
router.get('/rango-edad/:rangoEdadId', verifyToken, dificultadController.dificultad_by_rangoedad);
router.post('/', verifyToken, authorizeRoles('ADMIN'), dificultadController.dificultad_create);
router.put('/:id', verifyToken, authorizeRoles('ADMIN'), dificultadController.dificultad_update);
router.delete('/:id', verifyToken, authorizeRoles('ADMIN'), dificultadController.dificultad_delete);

module.exports = router;