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

//Middleware para validar token y verificar si puede entrar en la rutas privadas
app.use(
  expressjwt({
    secret: 'secretkey',
    algorithms: ['HS256'],
  }).unless({ path: ['/api/register', '/api/login'] })
);

//Rutas
app.use('/', index);
app.use('/api/tasks', tasksRoutes);
app.use('/api', usersRoutes);

// middleware para manejar errores
app.use((err, req, res, next) => {
  console.log(err);
  if (err.inner.name === 'TokenExpiredError') {
    return res.status(err.status).json({ msg: 'Expiro la sesion' });
  }
  if (err) {
    return res.status(err.status).json({ msg: 'Error de autenticacion' });
  }
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

app.listen(PORT, () => {
  console.log(`app en el port ${PORT}`);
});
