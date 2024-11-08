const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

// Configuración de CORS para permitir todos los orígenes
app.use(
  cors({
    origin: "*", // Permite solicitudes desde cualquier origen
  })
);

const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión a la base de datos establecida");
});

// Función para generar el token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, correo: user.correo },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h", // Expira en 1 hora
    }
  );
};

// Ruta de registro de usuario
app.post("/api/usuarios/registro", async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  // Verificar si el usuario ya existe
  db.query(
    "SELECT * FROM usuarios WHERE correo = ?",
    [correo],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });
      if (results.length > 0)
        return res.status(400).json({ error: "El correo ya está registrado" });

      // Cifrar la contraseña
      const hashedPassword = await bcrypt.hash(contraseña, 10);

      // Insertar el nuevo usuario en la base de datos
      db.query(
        "INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)",
        [nombre, correo, hashedPassword],
        (err, results) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Error al registrar usuario" });
          res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
        }
      );
    }
  );
});

// Ruta de inicio de sesión
app.post("/api/usuarios/login", (req, res) => {
  const { correo, contraseña } = req.body;

  // Buscar el usuario por correo electrónico
  db.query(
    "SELECT * FROM usuarios WHERE correo = ?",
    [correo],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Error en el servidor" });
      if (results.length === 0)
        return res.status(401).json({ error: "Credenciales incorrectas" });

      const user = results[0];

      // Verificar la contraseña
      const validPassword = await bcrypt.compare(contraseña, user.contraseña);
      if (!validPassword)
        return res.status(401).json({ error: "Credenciales incorrectas" });

      // Generar el token JWT
      const token = generateToken(user);
      res.json({ mensaje: "Inicio de sesión exitoso", token });
    }
  );
});

// ruta para reistrar la compra de tickets
app.post("/api/compras", (req, res) => {
  const { usuario_id, ticket_id, cantidad } = req.body;

  // verificar que todo los datos se presentan
  if (!usuario_id || !ticket_id || !cantidad) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  // Insertar la compra en la table ventas
  const query = "INSERT INTO ventas (usuario_id, ticket_id, cantidad) VALUES (?, ?, ?)";

  db.query(query, [usuario_id, ticket_id, cantidad], (err, results) => {
    if (err) {
      console.error("error al registrar la compra:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(201).json({ mensaje: "Compra registrada exitosamente" });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
