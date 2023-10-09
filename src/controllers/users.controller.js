//Importa la instancia del grupo de conexiones a la base de datos (pool), bcrypt para el hash de contraseñas y jsonwebtoken para la autenticación JWT
import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//Importa la clave secreta del archivo de configuración
import { TOKEN_KEY } from '../config.js';

//Controlador para crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    //Extrae datos del cuerpo de la solicitud
    const { username, password1, password2 } = req.body;

    //Verifica si los datos necesarios están presentes y cumplen con ciertas condiciones
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

    //Verifica si el nombre de usuario ya existe en la base de datos
    const [result] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (result[0]) {
      return res
        .status(400)
        .json({ msg: `El nombre de usuario "${username}" ya existe` });
    }

    //Crea un nuevo usuario con el nombre de usuario y la contraseña (hash) proporcionados
    const newUser = {
      username,
      password: password1,
    };

    //Realiza el hash de la contraseña antes de almacenarla en la base de datos
    bcrypt.hash(newUser.password, 12, async (err, hash) => {
      if (err)
        return res
          .status(500)
          .json({ msg: 'Hubo un error en la creacion del hash' });

      //Inserta el nuevo usuario en la base de datos con la contraseña hasheada
      await pool.query('INSERT INTO users (username,password) VALUES (?,?)', [
        newUser.username,
        hash,
      ]);
      res.json({ msg: 'Usuario creado' });
    });

    //Respuesta de éxito con un mensaje de bienvenida
    return res
      .status(200)
      .json({ msg: `Bienvenido ${username}, ya puedes iniciar sesión` });
  } catch (e) {
    console.log(e);
    //Respuesta de error en caso de cualquier excepción
    res.status(500).json({ msg: 'Hubo un error' });
  }
};

//Controlador para autenticar a un usuario
export const loginUser = async (req, res) => {
  //Obtiene los datos de inicio de sesión del cuerpo de la solicitud
  const userLogin = req.body;

  //Verifica si los datos necesarios están presentes
  if (!userLogin.username || !userLogin.password)
    return res.status(400).json({ msg: 'Faltan datos' });

  //Busca al usuario en la base de datos por su nombre de usuario
  const [result] = await pool.query('SELECT * FROM users WHERE username = ?', [
    userLogin.username,
  ]);

  //Obtiene el primer resultado de la consulta (debería haber solo uno debido a la unicidad del nombre de usuario)
  let user_DB = result[0];

  //Verifica si el usuario no existe en la base de datos
  if (user_DB === undefined)
    return res.status(401).json({ msg: 'Usuario o contraseña incorrectos' });

  //Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
  bcrypt.compare(userLogin.password, user_DB.password, (err, result) => {
    if (err) {
      //Respuesta de error en caso de cualquier excepción
      return res.status(500).json({ msg: 'Hubo un error en la comparación' });
    }
    if (!result) {
      //Respuesta de error si la contraseña es incorrecta
      return res.status(401).json({ msg: 'Usuario o contraseña incorrectos' });
    }

    //Si el usuario está autenticado, genera un token JWT que contiene la ID y el nombre de usuario del usuario
    let token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 3600, //El token expirará en 1 hora desde ahora
        id: user_DB.id,
        username: user_DB.username,
      },
      TOKEN_KEY
    );

    //Respuesta exitosa con el token JWT y el nombre de usuario del usuario
    res.json({ token: token, user: user_DB.username });
  });

  //Finaliza la ejecución de la función
  return;
};
