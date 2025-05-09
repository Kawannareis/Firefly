document.addEventListener("DOMContentLoaded", () => {
  const listaContatos = document.getElementById("listaContatos");
  const mensagemSucesso = document.getElementById("mensagemSucesso");
  const lixeiraContatos = document.querySelector(".lixeiraContatos");
  const btnVerLixeira = document.getElementById("verLixeira");

  let contatosCache = [];
  let contatoEmEdicao = null; // Para armazenar o ID em edição
  const usuarioId = 1; // Substitua pelo ID do usuário logado

  // Função para carregar os contatos
  async function carregarContatos() {
    const response = await fetch(`http://localhost:3000/api/contatos/${usuarioId}`);
    const contatos = await response.json();
    contatosCache = contatos;
    listaContatos.innerHTML = "";

    contatos.forEach((contato) => {
      const div = document.createElement("div");
      div.classList.add("contato");
      div.setAttribute("data-id", contato.id);
      div.innerHTML = `
        <h1>Nome: ${contato.nome}</h1>
        <h2>Telefone: ${contato.telefone}</h2>
        <h3>Email: ${contato.email}</h3>
        <button class="excluirContato" data-id="${contato.id}">X</button>
        <button class="editarContato" data-id="${contato.id}">Editar</button>
      `;
      listaContatos.appendChild(div);
    });
  }

  function mostrarMensagem() {
    mensagemSucesso.style.display = "block";
    setTimeout(() => {
      mensagemSucesso.style.display = "none";
    }, 3000);
  }

  async function carregarLixeira() {
    const response = await fetch(`http://localhost:3000/api/lixeira/${usuarioId}`);
    if (!response.ok) {
      console.error("Erro ao carregar a lixeira:", response.statusText);
      return;
    }

    const lixeira = await response.json();
    lixeiraContatos.innerHTML = "";

    if (lixeira.length === 0) {
      lixeiraContatos.innerHTML = "<p>Nenhum contato na lixeira.</p>";
    } else {
      lixeira.forEach((contato) => {
        const div = document.createElement("div");
        div.classList.add("contato");
        div.innerHTML = `
          <h1>Nome: ${contato.nome}</h1>
          <h2>Telefone: ${contato.telefone}</h2>
          <h3>Email: ${contato.email}</h3>
          <button class="restaurarContato" data-id="${contato.id}">Restaurar</button>
          <button class="removerDefinitivoContato" data-id="${contato.id}">Remover Definitivamente</button>
        `;
        lixeiraContatos.appendChild(div);
      });
    }
  }

  btnVerLixeira.addEventListener("click", async () => {
    const estaVisivel = lixeiraContatos.style.display === "block";
    if (estaVisivel) {
      lixeiraContatos.style.display = "none";
      btnVerLixeira.textContent = "Lixeira";
    } else {
      await carregarLixeira();
      lixeiraContatos.style.display = "block";
      btnVerLixeira.textContent = "Fechar Lixeira";
    }
  });

  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("excluirContato")) {
      const id = e.target.getAttribute("data-id");
      try {
        const response = await fetch(`http://localhost:3000/api/contatos/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          e.target.closest(".contato").remove();
          mostrarMensagem();
        } else {
          console.error("Erro ao excluir o contato:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao excluir o contato:", error);
      }
    }

    if (e.target.classList.contains("removerDefinitivoContato")) {
      const id = e.target.getAttribute("data-id");

      if (confirm("Tem certeza que deseja remover este contato permanentemente?")) {
        try {
          const response = await fetch(`http://localhost:3000/api/contatos/apagar/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            e.target.closest(".contato").remove();
            await carregarLixeira();
          } else {
            console.error("Erro ao remover permanentemente o contato.");
          }
        } catch (error) {
          console.error("Erro ao remover o contato permanentemente:", error);
        }
      }
    }

    if (e.target.classList.contains("restaurarContato")) {
      const id = e.target.getAttribute("data-id");
      await fetch(`http://localhost:3000/api/contatos/restaurar/${id}`, { method: "PUT" });
      await carregarLixeira();
      await carregarContatos();
    }

    if (e.target.classList.contains("editarContato")) {
      const id = e.target.getAttribute("data-id");
      const contato = contatosCache.find(c => c.id == id);

      if (contato) {
        contatoEmEdicao = id;
        document.getElementById("nome").value = contato.nome;
        document.getElementById("telefone").value = contato.telefone;
        document.getElementById("email").value = contato.email;
        document.getElementById("formContato").style.display = "block";
      }
    }
  });

  document.getElementById("criarContato").addEventListener("click", () => {
    contatoEmEdicao = null; // Limpa qualquer edição
    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("formContato").style.display = "block";
  });

  document.getElementById("fecharFormulario").addEventListener("click", () => {
    contatoEmEdicao = null;
    document.getElementById("formContato").style.display = "none";
  });

  document.getElementById("salvarContato").addEventListener("click", async () => {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();

  const somenteLetrasRegex = /^[A-Za-zÀ-ÿ\s]+$/;
  const somenteNumerosRegex = /^\d+$/;
  const emailValidoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validações
  if (!nome || !somenteLetrasRegex.test(nome)) {
    alert("Nome inválido. Use apenas letras e espaços.");
    return;
  }

  if (!telefone || !somenteNumerosRegex.test(telefone) || telefone.length < 8 || telefone.length > 12) {
  alert("Telefone inválido. Use apenas números entre 8 e 12 dígitos.");
  return;
}


  if (email && !emailValidoRegex.test(email)) {
    alert("Formato de e-mail inválido.");
    return;
  }

  const payload = { nome, telefone, email };

  if (contatoEmEdicao) {
    // Atualizar contato existente
    const response = await fetch(`http://localhost:3000/api/contatos/${contatoEmEdicao}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      contatoEmEdicao = null;
      document.getElementById("formContato").style.display = "none";
      document.getElementById("nome").value = "";
      document.getElementById("telefone").value = "";
      document.getElementById("email").value = "";
      await carregarContatos();
    } else {
      alert("Erro ao atualizar o contato.");
    }
  } else {
    // Criar novo contato
    payload.usuario_id = usuarioId;

    const response = await fetch("http://localhost:3000/api/contatos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      document.getElementById("formContato").style.display = "none";
      document.getElementById("nome").value = "";
      document.getElementById("telefone").value = "";
      document.getElementById("email").value = "";
      await carregarContatos();
    } else {
      alert("Erro ao salvar contato.");
    }
  }
});


  carregarContatos();
});

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
