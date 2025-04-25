const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',       
    user: 'root',   
    password: 'root', 
    database: 'agenda',
    port: 3306
});


db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('MySQL conectado com sucesso!');
});

app.post('/contatos', (req, res) => {
    console.log('Requisição recebida em /contatos');

    const { nome, numero, email } = req.body;
    console.log('Dados recebidos:', { nome, numero, email });

    const sql = 'INSERT INTO contatos (nome, numero, email) VALUES (?, ?, ?)';
    db.query(sql, [nome, numero, email], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err);
            return res.status(500).send('Erro ao adicionar contato');
        }
        console.log('✅ Contato adicionado com sucesso! ID:', result.insertId);
        res.status(200).send({ message: 'Contato adicionado com sucesso!' });
    });
});

app.get('/contatos', (req, res) => {
    db.query('SELECT * FROM contatos', (err, results) => {
        if (err) {
            console.error('Erro ao buscar contatos:', err);
            return res.status(500).send('Erro ao buscar contatos');
        }
        res.json(results);
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
