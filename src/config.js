// Importa la función config del módulo dotenv para cargar las variables de entorno desde el archivo .env
import { config } from 'dotenv';

// Carga las variables de entorno desde el archivo .env al entorno de Node.js
config();

// Configura las variables de entorno con valores predeterminados si no están definidas en el archivo .env

export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_DATABASE = process.env.DB_DATABASE || 'db_tasks';
export const DB_PORT = process.env.DB_PORT || 3306;
export const TOKEN_KEY = process.env.TOKEN_KEY;
