//Importa la clase Router de Express para manejar las rutas de la aplicación
import { Router } from 'express';

//Importa funciones del controlador tasks.controllers.js para manejar las operaciones relacionadas con las tareas
import {
  getTasks, //Función para obtener todas las tareas
  getTask, //Función para obtener una tarea por su ID
  createTask, //Función para crear una nueva tarea
  updateTask, //Función para actualizar una tarea existente
  deleteTask, //Función para eliminar una tarea por su ID
} from '../controllers/tasks.controllers.js';

//Crea una instancia de Router para definir las rutas relacionadas con las tareas
const router = Router();

//Define las rutas y asigna las funciones del controlador correspondientes a cada ruta

router.get('/list', getTasks);

router.get('/task/:id', getTask);

router.post('/create', createTask);

router.patch('/update-task/:id', updateTask);

router.delete('/delete-task/:id', deleteTask);

export default router;
