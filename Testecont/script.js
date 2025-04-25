// Animação dos litlle vagalumix //

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
    duration: duration,
    iterations: Infinity,
    direction: 'alternate',
    easing: 'ease-in-out'
  });
}

// Mostrar formulário // 
document.getElementById('criarContato').addEventListener('click', () => {
  document.getElementById('formContato').style.display = 'block';
});

// Adicionar contato (Reformulada) // 
document.getElementById('salvarContato').addEventListener('click', () => {
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const email = document.getElementById('email').value;

  if (nome && telefone && email) {
    const novoContato = document.createElement('div');
    novoContato.classList.add('contato');
    novoContato.innerHTML = `
      <h1>Nome: ${nome}</h1>
      <h2>Telefone: ${telefone}</h2>
      <h3>Email: ${email}</h3>
      <button class="excluirContato">Excluir</button>
    `;
    document.querySelector('.container').appendChild(novoContato);
    document.getElementById('formContato').reset();
    document.getElementById('formContato').style.display = 'none';
    aplicarEventosExcluir();
  } else {
    alert('Por favor, preencha todos os campos!');
  }
});

// Função para excluir contato : ) ( Sem erro) // 
function aplicarEventosExcluir() {
  document.querySelectorAll('.excluirContato').forEach(botao => {
    botao.onclick = () => {
      botao.parentElement.remove();
    };
  });
}

// coloca os eventos aos contatos que já existentess// 
aplicarEventosExcluir();

// Fechar formulário //
document.getElementById('fecharFormulario').addEventListener('click', () => {
    document.getElementById('formContato').style.display = 'none';
});

// Pesquisar contatos - teste -  //

// Filtrar contatos //
document.getElementById('pesquisarContato').addEventListener('input', function () {
const termo = this.value.toLowerCase();
const contatos = document.querySelectorAll('.contato');

contatos.forEach(contato => {
  const nome = contato.querySelector('h1').textContent.toLowerCase();
  contato.style.display = nome.includes(termo) ? 'block' : 'none';
});
});

