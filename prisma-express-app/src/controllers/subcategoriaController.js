const prisma = require('../config/prisma');
const { body, validationResult } = require('express-validator');

// GET todas las subcategorias
exports.subcategoria_list = async (req, res) => {
  try {
    const subcategorias = await prisma.subcategoria.findMany({
      include: { categoria: true }
    });
    res.json(subcategorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET detalle de una subcategoria
exports.subcategoria_detail = async (req, res) => {
  try {
    const subcategoria = await prisma.subcategoria.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { categoria: true }
    });

    if (subcategoria == null) {
      return res.status(404).json({ message: 'Subcategoria no encontrada' });
    }

    res.json(subcategoria);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET subcategorias por categoria
exports.subcategoria_by_categoria = async (req, res) => {
  try {
    const subcategorias = await prisma.subcategoria.findMany({
      where: { categoriaId: parseInt(req.params.categoriaId) },
      include: { categoria: true }
    });
    res.json(subcategorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST crear subcategoria
exports.subcategoria_create = [
  // Validar y sanitizar campos
  body('nombre', 'El nombre es requerido')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('descripcion')
    .optional({ values: 'falsy' })
    .trim()
    .escape(),
  body('categoriaId', 'La categoria es requerida')
    .trim()
    .isInt()
    .withMessage('El ID de categoria debe ser un numero entero'),

  // Procesar request despues de validacion
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      // Verificar que la categoria existe
      const categoriaExiste = await prisma.categoria.findUnique({
        where: { id: parseInt(req.body.categoriaId) }
      });

      if (!categoriaExiste) {
        return res.status(404).json({ message: 'La categoria especificada no existe' });
      }

      const subcategoria = await prisma.subcategoria.create({
        data: {
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          categoriaId: parseInt(req.body.categoriaId)
        },
        include: { categoria: true }
      });

      res.status(201).json(subcategoria);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

// PUT actualizar subcategoria
exports.subcategoria_update = [
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
  body('categoriaId')
    .optional()
    .isInt()
    .withMessage('El ID de categoria debe ser un numero entero'),

  // Procesar request
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      // Si se proporciona categoriaId, verificar que existe
      if (req.body.categoriaId) {
        const categoriaExiste = await prisma.categoria.findUnique({
          where: { id: parseInt(req.body.categoriaId) }
        });

        if (!categoriaExiste) {
          return res.status(404).json({ message: 'La categoria especificada no existe' });
        }
      }

      const subcategoria = await prisma.subcategoria.update({
        where: { id: parseInt(req.params.id) },
        data: {
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          activo: req.body.activo,
          categoriaId: req.body.categoriaId ? parseInt(req.body.categoriaId) : undefined
        },
        include: { categoria: true }
      });

      res.json(subcategoria);
    } catch (err) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Subcategoria no encontrada' });
      }
      res.status(500).json({ message: err.message });
    }
  }
];

// DELETE eliminar subcategoria
exports.subcategoria_delete = async (req, res) => {
  try {
    const subcategoria = await prisma.subcategoria.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (subcategoria == null) {
      return res.status(404).json({ message: 'Subcategoria no encontrada' });
    }

    await prisma.subcategoria.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Subcategoria eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};