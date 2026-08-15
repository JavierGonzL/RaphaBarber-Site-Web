# Plantilla: Crear Endpoint API

Usa esta plantilla para pedir a Claude Code un endpoint de Next.js API Route.

---

```
Contexto del proyecto:
- Next.js 14 App Router, TypeScript.
- ORM: Prisma con PostgreSQL.
- Archivo del cliente Prisma: `lib/db.ts` (singleton).

Tarea: Crear el endpoint `app/api/[recurso]/route.ts`

Método(s): [GET | POST | PUT | DELETE]

Lógica esperada:
- [describe qué hace: listar, crear, actualizar, borrar]
- [validaciones necesarias]
- [relaciones Prisma a incluir]

Schema Prisma relevante:
[pega aquí solo los modelos involucrados]

Restricciones:
- Manejo de errores con try/catch y respuestas JSON limpias
- Sin autenticación por ahora (agregar comentario TODO donde iría)
- Devuelve solo el código del archivo route.ts
```
