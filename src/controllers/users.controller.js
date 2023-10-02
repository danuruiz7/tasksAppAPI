import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TOKEN_KEY } from '../config.js';

export const createUser = async (req, res) => {
  try {
    const { username, password1, password2 } = req.body;
    if (!username || !password1 || !password2) {
      return res.status(400).json({ msg: 'Faltan datos' });
    }
    if (password1 !== password2) {
      return res.status(400).json({ msg: 'Contraseñas no coinciden' });
    } else if (password1.length < 3) {
      return res.status(400).json({ msg: 'Contraseña muy corta' });
    } else if (username.length < 3) {
      return res.status(400).json({ msg: 'Nombre de usuario muy corto' });
    } else if (username.length > 20) {
      return res.status(400).json({ msg: 'Nombre de usuario muy largo' });
    }

    const [result] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (result[0]) {
      return res
        .status(400)
        .json({ msg: `El nombre de usuario "${username}"  ya existe` });
    }

    const newUser = {
      username,
      password: password1,
    };

    bcrypt.hash(newUser.password, 12, async (err, hash) => {
      if (err)
        return res
          .status(500)
          .json({ msg: 'Hubo un error en la creacion del hash' });

      await pool.query('INSERT INTO users (username,password) VALUES (?,?)', [
        newUser.username,
        hash,
      ]);
      res.json({ msg: 'Usuario creado' });
    });

    return res
      .status(200)
      .json({ msg: `Bienvenido ${username} ya puedes iniciar sesion` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: 'Hubo un error' });
  }
};

export const loginUser = async (req, res) => {
  const userLogin = req.body;
  if (!userLogin.username || !userLogin.password)
    return res.status(400).json({ msg: 'Faltan datos' });

  const [result] = await pool.query('SELECT * FROM users WHERE username = ?', [
    userLogin.username,
  ]);

  let user_DB = result[0];
  if (user_DB === undefined)
    return res.status(401).json({ msg: 'Usuario o contraseña incorrectos' });

  bcrypt.compare(userLogin.password, user_DB.password, (err, result) => {
    if (err) {
      return res.status(500).json({ msg: 'Hubo un error en la comparacion' });
    }
    if (!result) {
      return res.status(401).json({ msg: 'Usuario o contraseña incorrectos' });
    }
    //Se el usuario esta autenticado se genera el token
    let token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 180, //El tiempo que expira el TOKEN
        id: user_DB.id,
        username: user_DB.username,
      },
      TOKEN_KEY
    );

    res.json({ token: token, user: user_DB.username });
  });
  return;
};
