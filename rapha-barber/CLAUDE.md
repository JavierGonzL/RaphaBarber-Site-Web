# RaphaBarber — Contexto del Proyecto

## Negocio
Barbería premium en México, conocida por ser la favorita de los futbolistas del **Club Pachuca**.
Diferenciadores: atención premium (bebidas para clientes), artículos firmados por jugadores, dinámicas para ganar servicios gratis, cursos de barbería, colectas de apoyo social, presencia fuerte en TikTok e Instagram.

## Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Estilos:** Tailwind CSS v4 + shadcn/ui
- **ORM:** Prisma con PostgreSQL (Supabase)
- **Deploy:** Vercel
- **Fuentes:** Bebas Neue (display/títulos), Inter (cuerpo)

## Paleta de colores
| Variable | Hex | Uso |
|---|---|---|
| Negro fondo | `#0A0A0A` | Fondo principal |
| Dorado | `#C9A84C` | Acento principal |
| Verde Pachuca | `#006847` | Acento secundario |
| Blanco hueso | `#F5F0E8` | Texto principal |
| Gris | `#9CA3AF` | Texto secundario |

## Estructura de carpetas
```
app/
  layout.tsx          # Layout raíz con Header y Footer
  page.tsx            # Landing: une todas las secciones
  globals.css         # Tailwind v4 + variables CSS
components/
  layout/
    Header.tsx        # Navbar fija, responsive
    Footer.tsx        # Footer con links y redes
  sections/
    Hero.tsx          # Hero con badge Pachuca
    Servicios.tsx     # Grid de servicios por categoría
    Nosotros.tsx      # Historia + vínculo Pachuca
    Dinamicas.tsx     # Dinámicas, cursos, apoyo social
    Contacto.tsx      # Dirección, horarios, WhatsApp, mapa
  ui/                 # Componentes shadcn/ui
lib/
  db.ts               # Cliente Prisma (singleton)
  utils.ts            # Utilidades shadcn
prisma/
  schema.prisma       # Modelos: Servicio, Barbero, Testimonio, Cita
```

## Convenciones
- Componentes: PascalCase (`HeroSection.tsx`)
- Rutas API: REST en `app/api/[recurso]/route.ts`
- Cliente Prisma: importar siempre desde `@/lib/db`
- `"use client"` solo cuando hay interactividad (hooks, eventos)
- Tailwind v4: configuración en `globals.css` bajo `@theme`, NO en `tailwind.config.ts`
- Variables de entorno públicas: prefijo `NEXT_PUBLIC_`

## Estado actual — Fase 1 (Sitio Informativo)
- [x] Layout, Header, Footer
- [x] Hero, Servicios, Nosotros, Dinámicas, Contacto
- [x] Schema Prisma definido
- [ ] Datos reales en componentes (actualmente hardcodeados)
- [ ] Conexión a base de datos (DATABASE_URL pendiente)
- [ ] Galería con fotos reales
- [ ] Embeds de TikTok/Instagram
- [ ] Google Maps embed

## Fase 2 (pendiente) — Reservas Online
- Sistema de citas (modelo `Cita` ya en schema)
- Panel admin
- Notificaciones WhatsApp/Email con Resend

## Variables de entorno necesarias (.env.local)
```
DATABASE_URL=          # PostgreSQL de Supabase
NEXT_PUBLIC_WHATSAPP=  # Número sin espacios ej: 521XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=  # URL del sitio
```

## Notas importantes
- WhatsApp links usan formato: `https://wa.me/${NEXT_PUBLIC_WHATSAPP}`
- Número de WhatsApp real: reemplazar `521XXXXXXXXXX` en Header, Hero y Contacto
- Imágenes de fondo del Hero en: `public/images/hero-bg.jpg` (pendiente de agregar)
- Sin autenticación aún; agregar `TODO: auth` donde sea necesario en Fase 2
