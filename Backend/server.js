const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'acela.proxy.rlwy.net',
    user: 'root',
    password: 'VWnCpMcptudAffkxlcfGxQyaMIjYaZgC',
    database: 'railway',
    port: '50514'
});

db.connect((err) => {
    if(err){
        console.error('Error al conectar', err);
    } else {
        console.log('Conexión establecida');
    }
});


app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if(err){
            res.status(500).send('Error al obtener productos');
            return;
        }

        res.json(result);
    });
});

app.get('/productos/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'SELECT * FROM productos WHERE id = ?',
        [id],
        (err, result) => {
            if(err){
                res.status(500).send('Error');
                return;
            }

            res.json(result[0]);
        }
    );
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});