# Bowling Club Gimnasia

El frontend React/Vite existente continúa ejecutándose con `npm run dev`. El backend se encuentra aislado en `backend/`, no contiene credenciales del cliente y es el único componente que contacta NegoPlus.

## Backend local

1. Copiar `.env.example` a `.env` y completar una base PostgreSQL local. No usar prefijos `VITE_` para secretos.
2. Ejecutar `npm install`, `npm run prisma:generate` y `npm run prisma:migrate`.
3. Crear la cuenta única inicial en la terminal: `ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:bootstrap`.
4. Iniciar el servicio con `npm run backend:dev`.

La sincronización sólo consulta `GET /magapi/rubros/5` y `GET /magapi/articulos/5`. Se ejecuta bajo `POST /api/admin/sync` con sesión administrativa y CSRF válido. Configure un scheduler autenticado de infraestructura para la ejecución periódica; no se incluye un secreto de scheduler en el repositorio.

## API

- Pública: `GET /api/public/{menu,categories,products,config,hours}`.
- Acceso: `POST /api/admin/auth/login` y `POST /api/admin/auth/logout`.
- Administración autenticada: configuración, horarios, ofertas, publicidad, mesas, reglas comerciales y estado/sincronización de catálogo bajo `/api/admin`.

Los precios los gestiona exclusivamente NegoPlus. Las observaciones quedan en `PriceHistory`; una reducción sólo es una observación y su visualización se controla separadamente en `OfferConfig`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
