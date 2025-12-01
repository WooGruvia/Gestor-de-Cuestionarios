-- CreateTable
CREATE TABLE "Dificultad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "rangoEdadId" INTEGER NOT NULL,
    CONSTRAINT "Dificultad_rangoEdadId_fkey" FOREIGN KEY ("rangoEdadId") REFERENCES "RangoEdad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
