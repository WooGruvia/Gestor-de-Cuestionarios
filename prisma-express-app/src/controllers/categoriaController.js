const prisma = require('../config/prisma');
const { body, validationResult } = require('express-validator');

// GET todas las categorias
exports.categoria_list = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: { subcategorias: true }
    });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET detalle de una categoria
exports.categoria_detail = async (req, res) => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { subcategorias: true }
    });

    if (categoria == null) {
      return res.status(404).json({ message: 'Categoria no encontrada' });
    }

    res.json(categoria);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST crear categoria
exports.categoria_create = [
  // Validar y sanitizar campos
  body('nombre', 'El nombre es requerido')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('descripcion')
    .optional({ values: 'falsy' })
    .trim()
    .escape(),

  // Procesar request despues de validacion
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      const categoria = await prisma.categoria.create({
        data: {
          nombre: req.body.nombre,
          descripcion: req.body.descripcion
        }
      });
      res.status(201).json(categoria);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

// PUT actualizar categoria
exports.categoria_update = [
  // Validar y sanitizar campos
  body('nombre', 'El nombre es requerido')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('descripcion')
    .optional({ values: 'falsy' })
    .trim()
    .escape(),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('Activo debe ser un valor booleano'),

  // Procesar request
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      const categoria = await prisma.categoria.update({
        where: { id: parseInt(req.params.id) },
        data: {
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          activo: req.body.activo
        }
      });

      res.json(categoria);
    } catch (err) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Categoria no encontrada' });
      }
      res.status(500).json({ message: err.message });
    }
  }
];

// DELETE eliminar categoria
exports.categoria_delete = async (req, res) => {
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { subcategorias: true }
    });

    if (categoria == null) {
      return res.status(404).json({ message: 'Categoria no encontrada' });
    }

    if (categoria.subcategorias.length > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar la categoria porque tiene subcategorias asociadas'
      });
    }

    await prisma.categoria.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Categoria eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};