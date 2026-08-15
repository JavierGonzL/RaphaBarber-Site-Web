# Stack y Arquitectura — RaphaBarber

## Stack Elegido
- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Estilos:** Tailwind CSS + shadcn/ui
- **Base de datos:** PostgreSQL vía Supabase (plan gratis)
- **ORM:** Prisma
- **Auth:** NextAuth.js (cuando se agreguen citas/admin)
- **Deploy:** Vercel
- **Emails:** Resend (confirmaciones de citas)
- **Pagos:** Stripe (futuro, para cursos o depósitos)

## Estructura de carpetas (front-end/)
```
front-end/
├── app/                    # Rutas (App Router)
│   ├── (marketing)/        # Páginas públicas
│   │   ├── page.tsx        # Landing / Home
│   │   ├── servicios/
│   │   ├── galeria/
│   │   ├── nosotros/
│   │   └── contacto/
│   ├── (admin)/            # Panel admin (futuro)
│   └── api/                # Endpoints backend
├── components/
│   ├── ui/                 # shadcn components
│   ├── sections/           # Secciones de landing
│   └── layout/             # Header, Footer, Nav
├── lib/
│   ├── db.ts               # Cliente Prisma
│   └── utils.ts
├── prisma/
│   └── schema.prisma
└── public/
    ├── images/
    └── icons/
```

## Estructura raíz recomendada (workspace)
```
RaphaBarber/
├── front-end/              # Next.js (sitio web)
├── back-end/               # API separada (solo si la necesitas en el futuro)
└── Sitio web para barbería/ # Notas y contexto en Obsidian
```

## Convenciones de código
- Componentes: PascalCase (`HeroSection.tsx`)
- Funciones utilitarias: camelCase
- Rutas API: REST simple (`/api/servicios`, `/api/citas`)
- Variables de entorno en `.env.local` (nunca commitear)

## Fase 1 — Sitio Informativo (actual)
- [ ] Landing con hero, servicios, galería, testimonios, contacto
- [ ] Sección especial: vínculo Pachuca
- [ ] Integración Instagram/TikTok embed
- [ ] SEO local (Google My Business schema)
- [ ] Formulario de contacto (WhatsApp o email)

## Fase 2 — Reservas Online (futuro)
- [ ] Calendario de citas
- [ ] Selección de barbero y servicio
- [ ] Confirmación por WhatsApp/Email
- [ ] Panel admin para ver/gestionar citas
