const prisma = require('../config/prisma');
const { body, validationResult } = require('express-validator');

// GET todas las dificultades
exports.dificultad_list = async (req, res) => {
  try {
    const dificultades = await prisma.dificultad.findMany({
      include: { rangoEdad: true }
    });
    res.json(dificultades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET detalle de una dificultad
exports.dificultad_detail = async (req, res) => {
  try {
    const dificultad = await prisma.dificultad.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { rangoEdad: true }
    });

    if (dificultad == null) {
      return res.status(404).json({ message: 'Dificultad no encontrada' });
    }

    res.json(dificultad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET dificultades por rango de edad
exports.dificultad_by_rangoedad = async (req, res) => {
  try {
    const dificultades = await prisma.dificultad.findMany({
      where: { rangoEdadId: parseInt(req.params.rangoEdadId) },
      include: { rangoEdad: true }
    });
    res.json(dificultades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST crear dificultad
exports.dificultad_create = [
  // Validar y sanitizar campos
  body('nombre', 'El nombre es requerido')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('rangoEdadId', 'El rango de edad es requerido')
    .trim()
    .isInt()
    .withMessage('El ID de rango de edad debe ser un numero entero'),

  // Procesar request despues de validacion
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      // Verificar que el rango de edad existe
      const rangoEdadExiste = await prisma.rangoEdad.findUnique({
        where: { id: parseInt(req.body.rangoEdadId) }
      });

      if (!rangoEdadExiste) {
        return res.status(404).json({ message: 'El rango de edad especificado no existe' });
      }

      const dificultad = await prisma.dificultad.create({
        data: {
          nombre: req.body.nombre,
          rangoEdadId: parseInt(req.body.rangoEdadId)
        },
        include: { rangoEdad: true }
      });

      res.status(201).json(dificultad);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

// PUT actualizar dificultad
exports.dificultad_update = [
  // Validar y sanitizar campos
  body('nombre', 'El nombre es requerido')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('rangoEdadId')
    .optional()
    .isInt()
    .withMessage('El ID de rango de edad debe ser un numero entero'),

  // Procesar request
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      // Si se proporciona rangoEdadId, verificar que existe
      if (req.body.rangoEdadId) {
        const rangoEdadExiste = await prisma.rangoEdad.findUnique({
          where: { id: parseInt(req.body.rangoEdadId) }
        });

        if (!rangoEdadExiste) {
          return res.status(404).json({ message: 'El rango de edad especificado no existe' });
        }
      }

      const dificultad = await prisma.dificultad.update({
        where: { id: parseInt(req.params.id) },
        data: {
          nombre: req.body.nombre,
          rangoEdadId: req.body.rangoEdadId ? parseInt(req.body.rangoEdadId) : undefined
        },
        include: { rangoEdad: true }
      });

      res.json(dificultad);
    } catch (err) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Dificultad no encontrada' });
      }
      res.status(500).json({ message: err.message });
    }
  }
];

// DELETE eliminar dificultad
exports.dificultad_delete = async (req, res) => {
  try {
    const dificultad = await prisma.dificultad.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (dificultad == null) {
      return res.status(404).json({ message: 'Dificultad no encontrada' });
    }

    await prisma.dificultad.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Dificultad eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};