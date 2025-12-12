const prisma = require('../config/prisma');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

//GET todos los usuarios (solo ADMIN)
exports.getAllUsers = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        activo: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      total: usuarios.length,
      usuarios
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//GET detalle de un usuario por ID (solo ADMIN)
exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        activo: true,
        createdAt: true
      }
    });

    if (usuario == null) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//GET perfil del usuario autenticado (cualquier usuario)
exports.getProfile = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        activo: true,
        createdAt: true
      }
    });

    if (usuario == null) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//PUT actualizar usuario (solo ADMIN)
exports.updateUser = [
  //Validar y sanitizar campos
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalido')
    .normalizeEmail(),
  body('nombre')
    .optional({ values: 'falsy' })
    .trim()
    .escape(),
  body('password')
    .optional({ values: 'falsy' })
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol')
    .optional()
    .isIn(['ADMIN', 'PROFESOR', 'ESTUDIANTE'])
    .withMessage('Rol invalido. Debe ser ADMIN, PROFESOR o ESTUDIANTE'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('Activo debe ser un valor booleano'),

  //Procesar request
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    try {
      const userId = parseInt(req.params.id);
      const { email, nombre, password, rol, activo } = req.body;

      //Datos de actualizacion
      const dataToUpdate = {};
      if (email) dataToUpdate.email = email;
      if (nombre) dataToUpdate.nombre = nombre;
      if (password) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
      }
      if (rol) dataToUpdate.rol = rol;
      if (activo !== undefined) dataToUpdate.activo = activo;

      const usuarioActualizado = await prisma.usuario.update({
        where: { id: userId },
        data: dataToUpdate,
        select: {
          id: true,
          email: true,
          nombre: true,
          rol: true,
          activo: true,
          createdAt: true
        }
      });

      res.json({
        message: 'Usuario actualizado exitosamente',
        usuario: usuarioActualizado
      });
    } catch (err) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      if (err.code === 'P2002') {
        return res.status(400).json({ message: 'El email ya esta en uso' });
      }
      res.status(500).json({ message: err.message });
    }
  }
];

//DELETE eliminar usuario (solo ADMIN)
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    //ADMIN no se puede eliminar a si mismo
    if (req.user.id === userId) {
      return res.status(400).json({ 
        message: 'No puedes eliminar tu propia cuenta' 
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (usuario == null) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    //Desactivar en lugar de eliminar
    const usuarioEliminado = await prisma.usuario.update({
      where: { id: userId },
      data: { activo: false },
      select: {
        id: true,
        email: true,
        nombre: true,
        activo: true
      }
    });

    res.json({
      message: 'Usuario desactivado exitosamente',
      usuario: usuarioEliminado
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};