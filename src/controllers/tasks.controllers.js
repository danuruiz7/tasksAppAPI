// Importa la instancia del grupo de conexiones a la base de datos (pool) y jsonwebtoken para la autenticación JWT
import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

// Controlador para obtener todas las tareas del usuario autenticado
export const getTasks = async (req, res) => {
  //Obtiene el token de autorización de la solicitud con el metodo split separar el token de la palabla Bearer(formato del token "Bearer aqui viene el token")
  const token = req.headers.authorization.split(' ')[1];
  const tokenDecodificado = jwt.verify(token, process.env.TOKEN_KEY);

  // Verifica si el token es válido
  if (!token || !tokenDecodificado)
    return res.status(401).json({ message: 'No autorizado' });

  // Obtiene el ID del usuario desde el token decodificado
  const userId = tokenDecodificado.id;

  try {
    // Consulta todas las tareas asociadas al usuario con el ID proporcionado
    const [result] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [
      userId,
    ]);
    // Responde con las tareas obtenidas de la base de datos
    res.json(result);
  } catch (error) {
    // Maneja errores y responde con un mensaje de error
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// Controlador para obtener una tarea específica por su ID
export const getTask = async (req, res) => {
  try {
    // Obtiene el ID de la tarea desde los parámetros de la solicitud
    const { id } = req.params;
    // Consulta la tarea en la base de datos por su ID
    const [result] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);

    // Verifica si la tarea fue encontrada y responde con la tarea, o devuelve un error si no se encontró
    if (result.length <= 0)
      return res.status(404).json({ message: 'Tarea no encontrada' });

    res.json(result[0]);
  } catch (error) {
    // Maneja errores y responde con un mensaje de error
    return res.status(500).json({ message: error.message });
  }
};

// Controlador para crear una nueva tarea
export const createTask = async (req, res) => {
  try {
    // Obtiene el título y la descripción de la tarea desde el cuerpo de la solicitud
    const { title, description } = req.body;
    // Verifica si los campos necesarios están presentes
    if (!title || !description)
      return res.status(400).json({ message: 'Los campos son obligatorios' });

    // Crea un nuevo objeto de tarea con el título, la descripción y el ID del usuario autenticado
    const newTask = {
      title,
      description,
      user_id: req.auth.id,
    };

    // Inserta la nueva tarea en la base de datos
    await pool.query('INSERT INTO tasks SET ?', [newTask]);
    // Responde con un mensaje de éxito
    res.json({ message: 'Tarea salvada' });
  } catch (error) {
    // Maneja errores y responde con un mensaje de error
    return res.status(500).json({ message: error.message });
  }
};

// Controlador para actualizar una tarea existente por su ID
export const updateTask = async (req, res) => {
  try {
    // Obtiene el ID de la tarea desde los parámetros de la solicitud y el título y la descripción desde el cuerpo de la solicitud
    const { id } = req.params;
    const { title, description } = req.body;

    // Actualiza la tarea en la base de datos con el título y la descripción proporcionados
    const [result] = await pool.query(
      'UPDATE tasks SET title = IFNULL(?,title), description = IFNULL(?,description) WHERE id = ?',
      [title, description, id]
    );

    // Verifica si la tarea fue encontrada y actualizada, o devuelve un error si no se encontró
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: 'Tarea no encontrada' });

    // Consulta la tarea actualizada en la base de datos y responde con la tarea actualizada
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    // Maneja errores y responde con un mensaje de error
    return res
      .status(500)
      .json({ error: 'Error interno del servidor', message: error.message });
  }
};

// Controlador para eliminar una tarea por su ID
export const deleteTask = async (req, res) => {
  try {
    // Obtiene el ID de la tarea desde los parámetros de la solicitud
    const { id } = req.params;
    // Elimina la tarea de la base de datos por su ID
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    // Verifica si la tarea fue encontrada y eliminada, o devuelve un error si no se encontró
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: 'Tarea no encontrada' });

    // Responde con un mensaje de éxito
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    // Maneja errores y responde con un mensaje de error
    return res.status(500).json({ message: error.message });
  }
};
