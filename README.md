
===========================================================================================
 MANUAL DE DESPLIEGUE - SERVIDOR SEGURO HTTPS
===========================================================================================
Este proyecto no incluye credenciales ni certificados en el repositorio por seguridad. 
Siga estos pasos detallados para configurar el entorno localmente.

===========================================================================================
 PASO 1: DESCARGA Y PREPARACION
===========================================================================================
Abra su terminal y ejecute los siguientes comandos para descargar el código e instalar las librerías.

>> SI USA TERMINAL LINUX / MACOS (O GIT BASH):
$ git clone https://github.com/WooGruvia/Gestor-de-Cuestionarios.git
$ cd Gestor-de-Cuestionarios
$ cd prisma-express-app
$ npm install

>> SI USA POWERSHELL (WINDOWS):
PS C:\> git clone https://github.com/WooGruvia/Gestor-de-Cuestionarios.git
PS C:\> cd Gestor-de-Cuestionarios
PS C:\Gestor-de-Cuestionarios> cd prisma-express-app
PS C:\Gestor-de-Cuestionarios\prisma-express-app> npm install
===========================================================================================
 PASO 2: BASE DE DATOS Y VISUALIZACION (SEED AUTOMATICO)
===========================================================================================
El sistema requiere configuración local y generará datos de prueba automáticamente.
-------------------------------------------------------------------------------------------
1. CONFIGURACION (.ENV)
   Dentro de la carpeta "prisma-express-app", cree un archivo llamado ".env" (solo la extensión) Puedes hacerlo desde Git Bash con:
$ touch .env

Abrir el .env con un editor de texto y agregar esta línea:

   DATABASE_URL="file:./dev.db"

**Esto le dice a Prisma: “la base de datos SQLite se llamará dev.db y estará en esta carpeta”.**
-------------------------------------------------------------------------------------------
2. CREACION Y POBLADO DE DATOS (SEED)
   Ejecute el comando correspondiente a su terminal para crear las tablas y llenar los datos de prueba:

   >> SI USA TERMINAL LINUX / MACOS (O GIT BASH):
   $ npx prisma migrate dev --name init

   >> SI USA POWERSHELL (WINDOWS):
   PS > npx prisma migrate dev --name init

¿QUÉ HACE ESTE COMANDO?
Al ejecutar este comando, Prisma realizará automáticamente dos acciones:
   a) Creará las tablas de la base de datos según el esquema definido.
   b) Ejecutará el script de poblado: `node prisma/seed.js`
   
IMPORTANTE: Observe la consola. Verá mensajes similares a estos:

   Running seed command `node prisma/seed.js` ...
   Se esta iniciando seed de la base de datos.
   ==================================================
   Limpiando la base de datos.
   Base de datos limpiada
   - Creando usuarios -
   3 usuarios creados.
   ==================================================
   - Creando categorias y subcategorias -
   5 categorias creadas.
   17 subcategorias creadas.
   ==================================================
   - Creando rangos de edad y dificultades -
   4 rangos de edad creados.
   12 niveles de dificultad creados.

   The seed command has been executed.


Esto confirma que se han creado automáticamente:
   - 3 Usuarios de prueba (Admin, Profesor, Estudiante)
   - 5 Categorías principales
   - 17 Subcategorías
   - Rangos de edad y niveles de dificultad
-------------------------------------------------------------------------------------------
3. VERIFICACION VISUAL (PRISMA STUDIO)
   Para ver y administrar estos datos en una interfaz gráfica, ejecute en la misma terminal:

   >> EN CUALQUIER TERMINAL:
   npx prisma studio

   Esto abrirá automáticamente su navegador en http://localhost:5555 mostrando todas las tablas.

===========================================================================================
 PASO 3: GENERACION DE CERTIFICADOS DE SEGURIDAD
===========================================================================================
Este paso es diferente según su sistema operativo. Puede crear sus certificados individualmente, o si quiere puede, elegir la opción que corresponda a su equipo para poder generar los certificados correspondientes.

OPCION A: SI USA WINDOWS (GIT BASH)
Abra la terminal Git Bash en la carpeta del proyecto. Debería verse así:

User@PC MINGW64 ~/Desktop/Gestor-de-Cuestionarios/prisma-express-app
$ openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365 -subj "//C=BO\ST=Cochabamba\L=Cochabamba\O=Universidad\OU=Sistemas\CN=localhost"

OPCION B: SI USA MACOS O LINUX (TERMINAL NORMAL)
Abra su terminal. Debería verse así:

user@macbook:~/Gestor-de-Cuestionarios/prisma-express-app$
openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365 -subj "/C=BO/ST=Cochabamba/L=Cochabamba/O=Universidad/OU=Sistemas/CN=localhost"

(Esto generará los archivos server.key y server.cert necesarios).

===========================================================================================
 PASO 4: EJECUCION
===========================================================================================
Inicie el servidor con el siguiente comando:

>> SI USA TERMINAL LINUX / MACOS:
$ npm start

>> SI USA POWERSHELL (WINDOWS):
PS C:\...\prisma-express-app> npm start

La consola confirmará con el siguiente mensaje: Servidor (HTTPS) Seguro corriendo en https://localhost:3443

===========================================================================================
 PASO 5: VERIFICACION
===========================================================================================
1. Abra su navegador en: https://localhost:3443
2. Acepte la alerta de seguridad (Configuración avanzada > Continuar).
3. Si todo esta correcto le aparecerá el siguiente mensaje en pantalla: Hola Mundo desde Express!
4. Abra el Inspector (F12) > Pestaña Red > Verifique que la columna Protocolo diga "h2".
