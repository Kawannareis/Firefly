document.addEventListener("DOMContentLoaded", () => {
  const listaContatos = document.getElementById("listaContatos");
  const mensagemSucesso = document.getElementById("mensagemSucesso");
  const lixeiraContatos = document.querySelector(".lixeiraContatos");
  const btnVerLixeira = document.getElementById("verLixeira");

  let contatosCache = [];
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

  // Exibir mensagem de sucesso
  function mostrarMensagem() {
    mensagemSucesso.style.display = "block";
    setTimeout(() => {
      mensagemSucesso.style.display = "none";
    }, 3000);
  }

  // Carregar lixeira
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

  // Alternar visibilidade da lixeira e texto do botão
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

  // Clique em excluir, restaurar ou remover definitivamente
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
  });

  // Carrega os contatos ao iniciar
  carregarContatos();
});
