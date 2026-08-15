# Plantilla: Generar Componente

Usa esta plantilla al pedirle a Claude Code un componente nuevo.  
Copia, rellena los `[campos]` y pega directo en Claude Code.

---

```
Contexto del proyecto:
- Barbería RaphaBarber, México. Vinculada al equipo Pachuca.
- Stack: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui.
- Paleta: [ver nota Referencias/Identidad Visual.md]

Tarea: Crear el componente `[NombreComponente]` en `components/sections/[NombreComponente].tsx`

Requisitos funcionales:
- [describe qué debe hacer]
- [props que recibe]

Requisitos visuales:
- [estilo, animaciones, responsive]
- Debe verse premium y oscuro/barbería

Restricciones:
- Solo Tailwind, sin CSS externo
- Componente cliente solo si necesita interactividad (agregar "use client")
- Sin librerías extra salvo las ya instaladas

Devuelve solo el código del componente, sin explicaciones.
```
