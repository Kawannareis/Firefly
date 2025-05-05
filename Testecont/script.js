// ========== Animação dos vaga-lumes ==========
const numFireflies = 50;
for (let i = 0; i < numFireflies; i++) {
  const firefly = document.createElement('div');
  firefly.classList.add('firefly');
  document.body.appendChild(firefly);
  firefly.style.top = Math.random() * window.innerHeight + 'px';
  firefly.style.left = Math.random() * window.innerWidth + 'px';
  animateFirefly(firefly);
}
function animateFirefly(firefly) {
  const deltaX = (Math.random() - 0.5) * 100;
  const deltaY = (Math.random() - 0.5) * 100;
  const duration = 4000 + Math.random() * 3000;
  firefly.animate([
    { transform: 'translate(0, 0)' },
    { transform: `translate(${deltaX}px, ${deltaY}px)` }
  ], {
    duration,
    iterations: Infinity,
    direction: 'alternate',
    easing: 'ease-in-out'
  });
}

// ========== Variáveis ==========
let contatoEditando = null;

// ========== Eventos principais ==========
document.getElementById('criarContato').addEventListener('click', () => {
  document.getElementById('formContato').style.display = 'block';
});

document.getElementById('fecharFormulario').addEventListener('click', () => {
  document.getElementById('formContato').style.display = 'none';
});

document.getElementById('pesquisarContato').addEventListener('input', function () {
  const termo = this.value.toLowerCase();
  document.querySelectorAll('.contato').forEach(contato => {
    const nome = contato.querySelector('h1').textContent.toLowerCase();
    contato.style.display = nome.includes(termo) ? 'block' : 'none';
  });
});

document.getElementById('salvarContato').addEventListener('click', () => {
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!nome || !telefone || !email) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  let contatosSalvos = JSON.parse(localStorage.getItem('contatos') || '[]');

  if (contatoEditando) {
    // Atualiza visual
    const nomeAntigo = contatoEditando.querySelector('h1').textContent.replace('Nome: ', '');
    const telefoneAntigo = contatoEditando.querySelector('h2').textContent.replace('Telefone: ', '');
    const emailAntigo = contatoEditando.querySelector('h3').textContent.replace('Email: ', '');

    contatoEditando.querySelector('h1').textContent = `Nome: ${nome}`;
    contatoEditando.querySelector('h2').textContent = `Telefone: ${telefone}`;
    contatoEditando.querySelector('h3').textContent = `Email: ${email}`;

    // Atualiza localStorage
    contatosSalvos = contatosSalvos.map(c => {
      if (c.nome === nomeAntigo && c.telefone === telefoneAntigo && c.email === emailAntigo) {
        return { nome, telefone, email };
      }
      return c;
    });
    localStorage.setItem('contatos', JSON.stringify(contatosSalvos));

    contatoEditando = null;
    document.getElementById('salvarContato').textContent = 'Salvar Contato';

  } else {
    const novoContato = document.createElement('div');
    novoContato.classList.add('contato');
    novoContato.innerHTML = `
      <h1>Nome: ${nome}</h1>
      <h2>Telefone: ${telefone}</h2>
      <h3>Email: ${email}</h3>
      <button class="excluirContato"> X </button>
      <button class="editarContato">Editar</button>
    `;

    // Inserir em ordem alfabética
    const container = document.querySelector('.container');
    const contatosExistentes = Array.from(container.querySelectorAll('.contato'));
    let inserido = false;
    for (let i = 0; i < contatosExistentes.length; i++) {
      const nomeExistente = contatosExistentes[i].querySelector('h1').textContent.replace('Nome: ', '').toLowerCase();
      if (nome.toLowerCase() < nomeExistente) {
        container.insertBefore(novoContato, contatosExistentes[i]);
        inserido = true;
        break;
      }
    }
    if (!inserido) {
      container.appendChild(novoContato);
    }

    // Atualiza localStorage
    contatosSalvos.push({ nome, telefone, email });
    contatosSalvos.sort((a, b) => a.nome.localeCompare(b.nome));
    localStorage.setItem('contatos', JSON.stringify(contatosSalvos));
  }

  limparFormulario();
  aplicarEventosEdicao();
  aplicarEventosExcluir();
  mostrarMensagemSucesso();
});

// ========== Funções auxiliares ==========
function limparFormulario() {
  document.getElementById('formContato').reset();
  document.getElementById('formContato').style.display = 'none';
}

function mostrarMensagemSucesso() {
  const msg = document.getElementById('mensagemSucesso');
  msg.style.display = 'block';
  setTimeout(() => msg.style.opacity = '1', 10);
  setTimeout(() => {
    msg.style.opacity = '0';
    setTimeout(() => msg.style.display = 'none', 500);
  }, 3000);
}

function aplicarEventosEdicao() {
  document.querySelectorAll('.editarContato').forEach(botao => {
    botao.onclick = () => {
      contatoEditando = botao.closest('.contato');
      document.getElementById('nome').value = contatoEditando.querySelector('h1').textContent.replace('Nome: ', '');
      document.getElementById('telefone').value = contatoEditando.querySelector('h2').textContent.replace('Telefone: ', '');
      document.getElementById('email').value = contatoEditando.querySelector('h3').textContent.replace('Email: ', '');
      document.getElementById('salvarContato').textContent = 'Atualizar Contato';
      document.getElementById('formContato').style.display = 'block';
    };
  });
}

function aplicarEventosExcluir() {
  document.querySelectorAll('.excluirContato').forEach(botao => {
    botao.onclick = () => {
      const contato = botao.closest('.contato');
      const confirmacao = confirm('Tem certeza que deseja excluir este contato?');
      if (!confirmacao) return;

      const nome = contato.querySelector('h1').textContent.replace('Nome: ', '');
      const telefone = contato.querySelector('h2').textContent.replace('Telefone: ', '');
      const email = contato.querySelector('h3').textContent.replace('Email: ', '');

      // Salvar na lixeira
      const contatosExcluidos = JSON.parse(localStorage.getItem('contatosExcluidos') || '[]');
      contatosExcluidos.push({ nome, telefone, email });
      localStorage.setItem('contatosExcluidos', JSON.stringify(contatosExcluidos));

      // Remover do localStorage de contatos ativos
      let contatosSalvos = JSON.parse(localStorage.getItem('contatos') || '[]');
      contatosSalvos = contatosSalvos.filter(c => !(c.nome === nome && c.telefone === telefone && c.email === email));
      localStorage.setItem('contatos', JSON.stringify(contatosSalvos));

      // Remover da tela
      contato.remove();
    };
  });
}

// ========== Restaurar e Excluir Definitivo ==========
function aplicarEventosRestaurar() {
  document.querySelectorAll('.restaurarContato').forEach(botao => {
    botao.onclick = () => {
      const contato = botao.closest('.contato-lixeira');
      const nome = contato.querySelector('h1').textContent.replace('Nome: ', '');
      const telefone = contato.querySelector('h2').textContent.replace('Telefone: ', '');
      const email = contato.querySelector('h3').textContent.replace('Email: ', '');

      // Remover da lixeira
      let contatosExcluidos = JSON.parse(localStorage.getItem('contatosExcluidos') || '[]');
      contatosExcluidos = contatosExcluidos.filter(c => !(c.nome === nome && c.telefone === telefone && c.email === email));
      localStorage.setItem('contatosExcluidos', JSON.stringify(contatosExcluidos));

      // Adicionar ao localStorage principal
      let contatosSalvos = JSON.parse(localStorage.getItem('contatos') || '[]');
      contatosSalvos.push({ nome, telefone, email });
      contatosSalvos.sort((a, b) => a.nome.localeCompare(b.nome));
      localStorage.setItem('contatos', JSON.stringify(contatosSalvos));

      // Adiciona na tela
      const novoContato = document.createElement('div');
      novoContato.classList.add('contato');
      novoContato.innerHTML = `
        <h1>Nome: ${nome}</h1>
        <h2>Telefone: ${telefone}</h2>
        <h3>Email: ${email}</h3>
        <button class="excluirContato"> X </button>
        <button class="editarContato">Editar</button>
      `;
      document.querySelector('.container').appendChild(novoContato);
      aplicarEventosEdicao();
      aplicarEventosExcluir();

      // Remove da lixeira visual
      contato.remove();
    };
  });
}

function aplicarEventosExcluirDefinitivo() {
  document.querySelectorAll('.excluirDefinitivo').forEach(botao => {
    botao.onclick = () => {
      if (confirm('Excluir definitivamente?')) {
        botao.closest('.contato').remove();
      }
    };
  });
}

// ========== Carregar contatos do localStorage ==========
window.onload = () => {
  const contatosSalvos = JSON.parse(localStorage.getItem('contatos') || '[]');
  const container = document.querySelector('.container');
  contatosSalvos.sort((a, b) => a.nome.localeCompare(b.nome));
  contatosSalvos.forEach(({ nome, telefone, email }) => {
    const div = document.createElement('div');
    div.classList.add('contato');
    div.innerHTML = `
      <h1>Nome: ${nome}</h1>
      <h2>Telefone: ${telefone}</h2>
      <h3>Email: ${email}</h3>
      <button class="excluirContato"> X </button>
      <button class="editarContato">Editar</button>
    `;
    container.appendChild(div);
  });

  aplicarEventosEdicao();
  aplicarEventosExcluir();
};
