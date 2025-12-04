const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = "secreto_super_seguro"; 
exports.register = async (req, res) => {
  try {
    const { email, password, nombre, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await prisma.usuario.create({
      data: { 
        email, 
        password: hashedPassword, 
        nombre, 
        rol: rol || "ESTUDIANTE"
      }
    });

    res.json({ mensaje: "Usuario creado exitosamente", email: nuevoUsuario.email });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar: El email ya existe o datos incorrectos' });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign( 
      { id: usuario.id, rol: usuario.rol, email: usuario.email },
      SECRET_KEY,
      { expiresIn: '1h' } 
    )

    res.cookie('access_token', token, {
      httpOnly: true, 
      secure: false,   
      sameSite: 'strict',
      maxAge: 3600000  
    }).json({ mensaje: 'Login exitoso', rol: usuario.rol });

  } catch (error) {
     console.error(error);
    res.status(500).json({ error: 'Error en el login' });
  }
};
exports.logout = (req, res) => {
  res.clearCookie('access_token').json({ mensaje: 'Sesion cerrada correctamente' });
};