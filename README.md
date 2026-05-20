# SIGEDII 2026-01

Aplicación web compuesta por:

- `backend`: API REST con Node.js, Express y MongoDB.
- `frontend`: Cliente web con React + Vite.

## Estructura Del Proyecto

```text
SIGEDII_2026-01/
├── backend/
│   ├── src/
│   │   ├── config/         # Conexión a MongoDB
│   │   ├── controllers/    # Lógica HTTP
│   │   ├── middlewares/    # Auth, roles, manejo de errores, etc.
│   │   ├── models/         # Esquemas de Mongoose
│   │   ├── routes/         # Rutas /usuarios y /api/hoja-vida
│   │   ├── services/       # Lógica de negocio
│   │   └── utils/          # JWT, correo, encriptación, helpers
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── context/        # Estado de autenticación
    │   ├── css/            # Estilos por página
    │   ├── pages/          # Vistas principales
    │   ├── routes/         # Definición de rutas React Router
    │   └── services/       # Cliente API
    └── package.json
```

## Tecnologias

- Backend: Node.js, Express, Mongoose, JWT, bcrypt, Multer, Resend.
- Frontend: React, React Router, Vite.
- Base de datos: MongoDB Atlas.

## Requisitos Previos

- Node.js 20 o superior.
- npm 10 o superior.
- Una base de datos MongoDB accesible.

## Variables De Entorno

### Backend (`backend/.env`)

Crear el archivo `backend/.env` con valores reales:

```dotenv
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>/<database>
PORT=8080
SECRET_KEY=<tu_clave_jwt_larga_y_segura>
RESEND_KEY=<tu_api_key_de_resend>
```

Notas:

- `PORT` define el puerto de la API (por defecto el proyecto usa `8080`).
- `SECRET_KEY` se usa para firmar y validar JWT.
- `RESEND_KEY` se usa para envio de correos de recuperacion.

### Frontend (`frontend/.env`) opcional

Si quieres configurar explicitamente la URL de la API:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

Si no se define, el frontend ya usa `http://localhost:8080` por defecto.

## Instalacion

Instalar dependencias en ambos proyectos:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Como Correr El Proyecto

Abrir dos terminales en paralelo.

1. Backend

```bash
cd backend
npm start
```

La API quedara corriendo en `http://localhost:8080`.

2. Frontend

```bash
cd frontend
npm run dev
```

Vite mostrara la URL local (normalmente `http://localhost:5173`).

## Scripts Disponibles

### Backend

- `npm start`: inicia el servidor Express (`src/App.js`).

### Frontend

- `npm run dev`: levanta el servidor de desarrollo de Vite.
- `npm run build`: genera build de produccion.
- `npm run preview`: previsualiza el build generado.
- `npm run lint`: ejecuta ESLint.

## Rutas API Principales

Base URL backend: `http://localhost:8080`

### Usuarios (`/usuarios`)

- `POST /usuarios/login`
- `POST /usuarios/registrarUsuario` (requiere token y rol `jefeTalentoHumano`)
- `POST /usuarios/recuperarContrasena`
- `PUT /usuarios/cambioContrasena-protegido` (requiere token)
- `PUT /usuarios/cambioContrasena`

### Hoja de vida (`/api/hoja-vida`)

- `GET /api/hoja-vida` (requiere token)
- `POST /api/hoja-vida` (requiere token)
- `PUT /api/hoja-vida` (requiere token)

## Flujo General De Desarrollo

1. Levantar backend.
2. Levantar frontend.
3. Ingresar por `/login` y navegar segun el rol autenticado.

## Recomendaciones

- No subir archivos `.env` con secretos reales al repositorio.
- Si ya se expusieron claves, rotarlas inmediatamente en los proveedores correspondientes.
