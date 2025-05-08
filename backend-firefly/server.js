const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json()); 
app.use(cors()); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'root', 
  database: 'agenda_contatos',
});

// Verifica a conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro na conexão com o banco de dados: ', err);
    return;
  }
  console.log('Conexão com o banco de dados bem-sucedida!');
});

// Bloco para obter os contatos
app.get('/contatos', (req, res) => {
  db.query('SELECT * FROM contatos', (err, results) => {
    if (err) {
      console.error('Erro ao buscar contatos: ', err);
      res.status(500).send('Erro ao buscar contatos');
      return;
    }
    res.json(results);
  });
});

// Bloco da criação do contato
app.post('/contatos', (req, res) => {
  const { nome, telefone, email } = req.body;

  if (!nome || !telefone || !email) {
    return res.status(400).json({ message: 'Nome, telefone e email são obrigatórios' });
  }

  db.query('INSERT INTO contatos (nome, telefone, email) VALUES (?, ?, ?)', [nome, telefone, email], (err, results) => {
    if (err) {
      console.error('Erro ao criar contato: ', err);
      res.status(500).send('Erro ao criar contato');
      return;
    }
    res.status(201).json({ id: results.insertId, nome, telefone, email });
  });
});

// Bloco de edição de contato (esta meio bugado mas vamos consertar)
app.put('/contatos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, telefone, email } = req.body;

  if (!nome || !telefone || !email) {
    return res.status(400).json({ message: 'Nome, telefone e email são obrigatórios' });
  }

  db.query('UPDATE contatos SET nome = ?, telefone = ?, email = ? WHERE id = ?', [nome, telefone, email, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar contato: ', err);
      res.status(500).send('Erro ao atualizar contato');
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Contato não encontrado');
    }
    res.json({ id, nome, telefone, email });
  });
});

// Bloco de exclusão de contato
app.delete('/contatos/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM contatos WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erro ao excluir contato: ', err);
      res.status(500).send('Erro ao excluir contato');
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Contato não encontrado');
    }
    res.status(204).send();
  });
});

// Iniciando servidor/ mensagem para confirmar a conexão
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
