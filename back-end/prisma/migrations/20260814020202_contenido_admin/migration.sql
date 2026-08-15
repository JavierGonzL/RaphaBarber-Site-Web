-- CreateTable
CREATE TABLE "Promocion" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "vigenciaInicio" TIMESTAMP(3),
    "vigenciaFin" TIMESTAMP(3),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promocion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoDestacado" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "urlTiktok" TEXT NOT NULL,
    "etiqueta" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoDestacado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaReconocida" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT,
    "fotoUrl" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonaReconocida_pkey" PRIMARY KEY ("id")
);
