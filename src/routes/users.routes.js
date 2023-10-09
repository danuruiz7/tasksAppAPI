//Importa la clase Router de Express para manejar las rutas de la aplicación
import { Router } from 'express';

//Importa las funciones del controlador users.controller.js para manejar las operaciones relacionadas con los usuarios
import { createUser, loginUser } from '../controllers/users.controller.js';

//Crea una instancia de Router para definir las rutas relacionadas con los usuarios
const router = Router();

//Define las rutas y asigna las funciones del controlador correspondientes

router.post('/register', createUser);

router.post('/login', loginUser);

export default router;
