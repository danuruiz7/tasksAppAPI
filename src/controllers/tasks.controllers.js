import { pool } from '../db.js';
import jwt from 'jsonwebtoken';

export const getTasks = async (req, res) => {
  console.log('inicio');
  const token = req.headers.authorization.split(' ')[1];

  const tokenDecodificado = jwt.verify(token, process.env.TOKEN_KEY);

  if (!token || !tokenDecodificado)
    return res.status(401).json({ message: 'No autorizado' });

  const userId = tokenDecodificado.id;
  try {
    const [result] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [
      userId,
    ]);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);

    if (result.length <= 0)
      return res.status(404).json({ message: 'Tarea no encontrada' });

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'Los campos son obligatorios' });
    const newTask = {
      title,
      description,
      user_id: req.auth.id,
    };
    await pool.query('INSERT INTO tasks SET ?', [newTask]);
    res.json({ message: 'Tarea salvada' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const [result] = await pool.query(
      'UPDATE tasks SET title = IFNULL(?,title), description = IFNULL(?,description) WHERE id = ?',
      [title, description, id]
    );
    if (result.affectedRows <= 0)
      return res.status(404).json({ message: 'Tarea no encontrada' });

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    console.log(rows);
    res.status(200).json(rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error interno del servidor', message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
