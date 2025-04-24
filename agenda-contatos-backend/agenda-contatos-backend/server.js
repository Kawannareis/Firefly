const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: '10.113.35.12', 
    user: 'root', 
    password: 'root',
    database: 'agenda',
    port: 3306             
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL conectado!');
});

app.post('/contatos', (req, res) => {
    const { nome, numero, email } = req.body;
    const sql = 'INSERT INTO contatos (nome, numero, email) VALUES (?, ?, ?)';
    db.query(sql, [nome, numero, email], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ message: 'Contato adicionado com sucesso!' });
    });
});

app.get('/contatos', (req, res) => {
    db.query('SELECT * FROM contatos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
