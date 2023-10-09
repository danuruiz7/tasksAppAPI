import express from 'express';
import cors from 'cors';
import { expressjwt } from 'express-jwt';

import tasksRoutes from './routes/tasks.routes.js';
import usersRoutes from './routes/users.routes.js';
import index from './routes/index.routes.js';
import { PORT } from './config.js';
const app = express();
app.use(cors());
app.use(express.json());

//Middleware para validar el token JWT y restringir el acceso a las rutas privadas
app.use(
  expressjwt({
    secret: 'secretkey', //Clave secreta para firmar y verificar el token JWT
    algorithms: ['HS256'], //Algoritmo de encriptación utilizado para el token JWT
  }).unless({ path: ['/api/register', '/api/login'] }) //Excluye las rutas de registro y inicio de sesión de la autenticación JWT
);

//Rutas
app.use('/', index); //Asocia las rutas del índice a la raíz del servidor
app.use('/api/tasks', tasksRoutes); //Asocia las rutas de tareas a '/api/tasks'
app.use('/api', usersRoutes); //Asocia las rutas de usuarios a '/api'

//Middleware para manejar errores
app.use((err, req, res, next) => {
  // console.log(err);
  if (err.inner.name === 'TokenExpiredError') {
    return res.status(err.status).json({ msg: 'Expiro la sesion' });
  }
  if (err) {
    return res.status(err.status).json({ msg: 'Error de autenticacion' });
  }
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`app en el port ${PORT}`);
});
