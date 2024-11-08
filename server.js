// app.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const db = require('./db'); // Asegúrate de importar la conexión a la base de datos
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;



// Función para generar el token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id, correo: user.correo }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Expira en 1 hora
    });
};

// Ruta de registro de usuario
app.post('/api/usuarios/registro', async (req, res) => {
    const { nombre, correo, contraseña } = req.body;

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length > 0) return res.status(400).json({ error: 'El correo ya está registrado' });

        // Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Insertar el nuevo usuario en la base de datos
        db.query(
            'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)',
            [nombre, correo, hashedPassword],
            (err, results) => {
                if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
                res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
            }
        );
    });
});

// Ruta de inicio de sesión
app.post('/api/usuarios/login', (req, res) => {
    const { correo, contraseña } = req.body;

    // Buscar el usuario por correo electrónico
    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (results.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });

        const user = results[0];

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(contraseña, user.contraseña);
        if (!validPassword) return res.status(401).json({ error: 'Credenciales incorrectas' });

        // Generar el token JWT
        const token = generateToken(user);
        res.json({ mensaje: 'Inicio de sesión exitoso', token });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

