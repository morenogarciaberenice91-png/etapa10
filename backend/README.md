# Servicios Técnicos

## Descripción
Aplicación web full-stack para gestionar la administración de clientes, técnicos y órdenes de servicios técnicos.

## Tecnologías
- **Frontend:** React, React Router, CSS
- **Backend:** Python, Flask, Flask-CORS
- **Base de Datos:** MySQL
- **Pruebas de API:** Thunder Client / Postman

## Requisitos
- Python 3.10+
- Node.js 18+ y npm
- MySQL Server

## Configuración del Proyecto

### 1. Base de Datos
- Crear la base de datos en MySQL con el nombre `tecnico`.
- Importar el archivo SQL ubicado en `database/tecnico.sql`.

### 2. Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto tomando como base `.env.example`:
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tecnico
FLASK_DEBUG=1