-- CreateTable
CREATE TABLE "IntegracionGoogle" (
    "id" TEXT NOT NULL,
    "cuentaEmail" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL DEFAULT 'primary',
    "refreshTokenCifrado" TEXT NOT NULL,
    "conectadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegracionGoogle_pkey" PRIMARY KEY ("id")
);
