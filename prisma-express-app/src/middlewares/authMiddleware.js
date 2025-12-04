const jwt = require('jsonwebtoken');
const SECRET_KEY = "secreto_super_seguro";


exports.verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).json({ 
      error: 'Acceso denegado. No se proporciono token de autenticacion' 
    });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = {
      id: decoded.id, 
      email: decoded.email,
      rol: decoded.rol 
    };
    
    next();
    } catch (error) {
        return res.status(401).json({ 
            error: 'Token invalido o expirado',
            detalle: error.message 
        });
    }
};

exports.authorizeRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado. Usa verifyToken antes de authorizeRoles' 
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: `Acceso denegado. Solo puede hacerlo: ${rolesPermitidos.join(', ')}`,
        tuRol: req.user.rol
      });
    }

    next();
  };
};