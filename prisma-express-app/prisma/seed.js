const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Se esta iniciando seed de la base de datos...');
  console.log('='.repeat(20));

  //LIMPIAR BASE DE DATOS
  console.log('Limpiando base de datos...');
  
  await prisma.dificultad.deleteMany();
  await prisma.rangoEdad.deleteMany();
  await prisma.subcategoria.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();
  
  console.log('Base de datos limpiada');


  //CREAR USUARIOS
  console.log('Creando usuarios...');

  const usuarios = await Promise.all([
    prisma.usuario.create({
      data: {
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin123', 10),
        nombre: 'Admin',
        rol: 'ADMIN',
        activo: true
      }
    }),
    prisma.usuario.create({
      data: {
        email: 'profesor1@gmail.com',
        password: await bcrypt.hash('profesor123', 10),
        nombre: 'Juan Profesor',
        rol: 'PROFESOR',
        activo: true
      }
    }),
    prisma.usuario.create({
      data: {
        email: 'estudiante1@gmail.com',
        password: await bcrypt.hash('estudiante123', 10),
        nombre: 'Maria Elena Estudiante',
        rol: 'ESTUDIANTE',
        activo: true
      }
    })
  ]);

  console.log(`${usuarios.length} usuarios creados.`);
  console.log('='.repeat(50));
  

  //CREAR CATEGORIAS CON SUBCATEGORIAS
  console.log('Creando categorias y subcategorias...');

  // Categoria 1: Matematicas
  await prisma.categoria.create({
    data: {
      nombre: 'Matemáticas',
      descripcion: 'Problemas matemáticos',
      subcategorias: {
        create: [
          { nombre: 'Calculo 2', descripcion: 'Operaciones de suma' },
          { nombre: 'Algebra 1', descripcion: 'Operaciones de Algebra 1' },
          { nombre: 'Algebra 2', descripcion: 'Operaciones de Algebra 2' },
          { nombre: 'Geometria', descripcion: 'Operaciones de Geometria' }
        ]
      }
    }
  });

  // Categoria 2: Ciencias Sociales
  await prisma.categoria.create({
    data: {
      nombre: 'Ciencias Sociales',
      descripcion: 'Referentes a las diferentes ciencias sociales como Historia, etc.',
      subcategorias: {
        create: [
          { nombre: 'Geografia', descripcion: 'Cuestionarios de Geografia' },
          { nombre: 'Historia Nacional', descripcion: 'Cuestionarios de historia nacional' },
          { nombre: 'Historia Universal', descripcion: 'Cuestionarios de historia universal' }
        ]
      }
    }
  });

  // Categoria 3: Ciencias Naturales
  await prisma.categoria.create({
    data: {
      nombre: 'Ciencias Naturales',
      descripcion: 'Referentes a las diferentes ciencias y estudios de sistemas y ecosistemas.',
      subcategorias: {
        create: [
          { nombre: 'Biología', descripcion: 'Cuestionarios de Biología' },
          { nombre: 'Química', descripcion: 'Cuestionarios de Química' },
          { nombre: 'Botánica', descripcion: 'Cuestionarios de Botánica' },
          { nombre: 'Zoología', descripcion: 'Cuestionarios de Zoología' }
        ]
      }
    }
  });

  // Categoria 4: Informatica
  await prisma.categoria.create({
    data: {
      nombre: 'Informatica',
      descripcion: 'Referentes a las diferentes ciencias tecnologicas de software,etc.',
      subcategorias: {
        create: [
          { nombre: 'Programación', descripcion: 'Cuestionarios y problemas de Programación' },
          { nombre: 'Redes', descripcion: 'Cuestionarios y problemas de Redes' },
          { nombre: 'Inteligencia Artificial', descripcion: 'Cuestionarios y problemas de Inteligencia Artificial' }
        ]
      }
    }
  });

  // Categoria 5: Humanidades
  await prisma.categoria.create({
    data: {
      nombre: 'Humanidades',
      descripcion: 'Referentes a las diferentes ciencias filosoficas y linguisticas.',
      subcategorias: {
        create: [
          { nombre: 'Lenguaje', descripcion: 'Cuestionarios de Lenguaje' },
          { nombre: 'Filosofía', descripcion: 'Cuestionarios de Filosofía' },
          { nombre: 'Idiomas', descripcion: 'Cuestionarios de Idiomas' }
        ]
      }
    }
  });

  const categorias = await prisma.categoria.findMany({
    include: { subcategorias: true }
  });
  
  const totalSubcategorias = categorias.reduce((sum, cat) => sum + cat.subcategorias.length, 0);
  console.log(`${categorias.length} categorias creadas.`);
  console.log(`${totalSubcategorias} subcategorias creadas.`);
  console.log('='.repeat(20));


  //CREAR RANGOS DE EDAD CON DIFICULTADES
  console.log('Creando rangos de edad y dificultades...');

  // Rango 1: 6-8 años
  await prisma.rangoEdad.create({
    data: {
      nombre: '6-8 años',
      edad_min: 6,
      edad_max: 8,
      dificultades: {
        create: [
          { nombre: 'Fácil' },
          { nombre: 'Medio' },
          { nombre: 'Dificil' }
        ]
      }
    }
  });

  // Rango 2: 9-11 años
  await prisma.rangoEdad.create({
    data: {
      nombre: '9-11 años',
      edad_min: 9,
      edad_max: 11,
      dificultades: {
        create: [
          { nombre: 'Fácil' },
          { nombre: 'Medio' },
          { nombre: 'Difícil' }
        ]
      }
    }
  });

  // Rango 3: 12-14 años
  await prisma.rangoEdad.create({
    data: {
      nombre: '12-14 años',
      edad_min: 12,
      edad_max: 14,
      dificultades: {
        create: [
          { nombre: 'Fácil' },
          { nombre: 'Medio' },
          { nombre: 'Difícil' }
        ]
      }
    }
  });

  // Rango 4: 15-18 años
  await prisma.rangoEdad.create({
    data: {
      nombre: '15-18 años',
      edad_min: 15,
      edad_max: 18,
      dificultades: {
        create: [
          { nombre: 'Fácil' },
          { nombre: 'Medio' },
          { nombre: 'Difícil' }
        ]
      }
    }
  });

  const rangos = await prisma.rangoEdad.findMany({
    include: { dificultades: true }
  });
  
  const totalDificultades = rangos.reduce((sum, rango) => sum + rango.dificultades.length, 0);
  console.log(`${rangos.length} rangos de edad creados.`);
  console.log(`${totalDificultades} niveles de dificultad creados.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error durante el seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });