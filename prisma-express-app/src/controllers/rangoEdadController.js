const prisma = require('../config/prisma');
const { body, validationResult } = require('express-validator');

// GET todos los rangos de edad
exports.rangoedad_list = async (req, res) => {
  try {
    const rangosEdad = await prisma.rangoEdad.findMany({
      include: { dificultades: true }
    });
    res.json(rangosEdad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET detalle de un rango de edad
exports.rangoedad_detail = async (req, res) => {
  try {
    const rangoEdad = await prisma.rangoEdad.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { dificultades: true }
    });

    if (rangoEdad == null) {
      return res.status(404).json({ message: 'Rango de edad no encontrado' });
    }

    res.json(rangoEdad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST crear rango de edad
exports.rangoedad_create = [
  // Validar y sanitizar campos
  body('nombre', 'El nombre es requerido')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('edad_min', 'La edad minima es requerida')
    .isInt({ min: 0 })
    .withMessage('La edad minima debe ser un numero entero positivo'),
  body('edad_max', 'La edad maxima es requerida')
    .isInt({ min: 0 })
    .withMessage('La edad maxima debe ser un numero entero positivo')
    .custom((value, { req }) => {
      if (value <= req.body.edad_min) {
        throw new Error('La edad maxima debe ser mayor que la edad minima');
      }
      return true;
    }),

  // Procesar request despues de validacion
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      const rangoEdad = await prisma.rangoEdad.create({
        data: {
          nombre: req.body.nombre,
          edad_min: parseInt(req.body.edad_min),
          edad_max: parseInt(req.body.edad_max)
        }
      });

      res.status(201).json(rangoEdad);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

// PUT actualizar rango de edad
exports.rangoedad_update = [
  // Validar y sanitizar campos
  body('nombre', 'El nombre es requerido')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('edad_min', 'La edad mínima es requerida')
    .isInt({ min: 0 })
    .withMessage('La edad minima debe ser un numero entero positivo'),
  body('edad_max', 'La edad maxima es requerida')
    .isInt({ min: 0 })
    .withMessage('La edad msxima debe ser un numero entero positivo')
    .custom((value, { req }) => {
      if (value <= req.body.edad_min) {
        throw new Error('La edad maxima debe ser mayor que la edad minima');
      }
      return true;
    }),

  // Procesar request
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      const rangoEdad = await prisma.rangoEdad.update({
        where: { id: parseInt(req.params.id) },
        data: {
          nombre: req.body.nombre,
          edad_min: parseInt(req.body.edad_min),
          edad_max: parseInt(req.body.edad_max)
        }
      });

      res.json(rangoEdad);
    } catch (err) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Rango de edad no encontrado' });
      }
      res.status(500).json({ message: err.message });
    }
  }
];

// DELETE eliminar rango de edad
exports.rangoedad_delete = async (req, res) => {
  try {
    const rangoEdad = await prisma.rangoEdad.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { dificultades: true }
    });

    if (rangoEdad == null) {
      return res.status(404).json({ message: 'Rango de edad no encontrado' });
    }

    if (rangoEdad.dificultades.length > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar el rango de edad porque tiene dificultades asociadas'
      });
    }

    await prisma.rangoEdad.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Rango de edad eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};