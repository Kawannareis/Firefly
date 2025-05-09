const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'agenda'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

// Rotas

// Cadastro de usuário
app.post('/api/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
  }

  const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  db.query(sql, [nome, email, senha], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ mensagem: 'Email já cadastrado.' });
      }
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro no servidor.' });
    }
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  });
});

// Login de usuário
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  db.query(sql, [email, senha], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro no servidor.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }

    res.status(200).json({ mensagem: 'Login bem-sucedido.', usuario: results[0] });
  });
});

// Cadastro de contato
app.post('/api/contatos', (req, res) => {
  const { nome, telefone, email, usuario_id } = req.body;

  if (!nome || !telefone || !usuario_id) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios (nome, telefone e usuário).' });
  }

  const sql = 'INSERT INTO contatos (nome, telefone, email, status, usuario_id) VALUES (?, ?, ?, "ativo", ?)';
  db.query(sql, [nome, telefone, email, usuario_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao cadastrar o contato.' });
    }
    res.status(201).json({ mensagem: 'Contato cadastrado com sucesso!' });
  });
});

// Listar contatos do usuário
app.get('/api/contatos/:usuario_id', (req, res) => {
  const usuario_id = req.params.usuario_id;

  const sql = 'SELECT id, nome, telefone, email FROM contatos WHERE usuario_id = ? AND status = "ativo"';
  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao buscar contatos.' });
    }
    res.json(results);
  });
});

// Remover contato (mover para a lixeira)
app.delete('/api/contatos/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'UPDATE contatos SET status = "removido" WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao remover contato.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Contato não encontrado.' });
    }

    res.json({ mensagem: 'Contato movido para a lixeira.' });
  });
});

// Listar contatos na lixeira do usuário
app.get('/api/lixeira/:usuario_id', (req, res) => {
  const usuario_id = req.params.usuario_id;

  const sql = 'SELECT id, nome, telefone, email FROM contatos WHERE usuario_id = ? AND status = "removido"';
  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao buscar contatos na lixeira.' });
    }
    res.json(results);
  });
});

// Restaurar contato da lixeira
app.put('/api/contatos/restaurar/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'UPDATE contatos SET status = "ativo" WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao restaurar contato.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Contato não encontrado na lixeira.' });
    }

    res.json({ mensagem: 'Contato restaurado com sucesso.' });
  });
});

// Remover contato permanentemente
app.delete('/api/contatos/apagar/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM contatos WHERE id = ? AND status = "removido"';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao remover contato definitivamente.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Contato não encontrado ou ainda está ativo.' });
    }

    res.json({ mensagem: 'Contato removido permanentemente.' });
  });
});

// Editar contato
app.put('/api/contatos/:id', (req, res) => {
  const { nome, telefone, email } = req.body;
  const id = req.params.id;

  if (!nome || !telefone) {
    return res.status(400).json({ mensagem: 'Nome e telefone são obrigatórios.' });
  }

  const sql = 'UPDATE contatos SET nome = ?, telefone = ?, email = ? WHERE id = ?';
  db.query(sql, [nome, telefone, email, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao editar o contato.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Contato não encontrado.' });
    }

    res.json({ mensagem: 'Contato atualizado com sucesso.' });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
