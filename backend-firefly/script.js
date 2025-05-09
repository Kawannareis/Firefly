document.addEventListener("DOMContentLoaded", () => {
  const listaContatos = document.getElementById("listaContatos");
  const btnCriarContato = document.getElementById("criarContato");
  const formContato = document.getElementById("formContato");
  const btnFecharFormulario = document.getElementById("fecharFormulario");
  const btnSalvarContato = document.getElementById("salvarContato");
  const mensagemSucesso = document.getElementById("mensagemSucesso");
  const inputPesquisa = document.getElementById("pesquisarContato");
  const lixeiraContatos = document.querySelector(".lixeiraContatos");
  const btnVerLixeira = document.getElementById("verLixeira");

  let indiceEditando = null;
  let contatosCache = [];

  async function carregarContatos() {
    const response = await fetch("/contatos");
    const contatos = await response.json();
    contatosCache = contatos;
    listaContatos.innerHTML = "";

    contatos.forEach((contato, index) => {
      const div = document.createElement("div");
      div.classList.add("contato");
      div.innerHTML = `
        <h1>Nome: ${contato.nome}</h1>
        <h2>Telefone: ${contato.telefone}</h2>
        <h3>Email: ${contato.email}</h3>
        <button class="excluirContato" data-id="${contato.id}">X</button>
        <button class="editarContato" data-index="${index}">Editar</button>
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

  btnCriarContato.addEventListener("click", () => {
    formContato.style.display = "block";
    indiceEditando = null;
    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
  });

  btnFecharFormulario.addEventListener("click", () => {
    formContato.style.display = "none";
  });

  btnSalvarContato.addEventListener("click", async () => {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    if (nome && telefone && email) {
      const contato = { nome, telefone, email };

      if (indiceEditando !== null) {
        const id = contatosCache[indiceEditando].id;
        await fetch(`/contatos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contato),
        });
      } else {
        await fetch("/contatos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contato),
        });
      }

      formContato.style.display = "none";
      indiceEditando = null;
      carregarContatos();
    }
  });

  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("excluirContato")) {
      const id = e.target.getAttribute("data-id");
      await fetch(`/contatos/${id}`, { method: "DELETE" });
      carregarContatos();
      mostrarMensagem();
    }

    if (e.target.classList.contains("editarContato")) {
      indiceEditando = e.target.getAttribute("data-index");
      const contato = contatosCache[indiceEditando];

      document.getElementById("nome").value = contato.nome;
      document.getElementById("telefone").value = contato.telefone;
      document.getElementById("email").value = contato.email;

      formContato.style.display = "block";
    }

    if (e.target.classList.contains("restaurarContato")) {
      const id = e.target.getAttribute("data-id");
      await fetch(`/lixeira/restaurar/${id}`, { method: "POST" });
      btnVerLixeira.click(); // atualiza lixeira
      carregarContatos();    // atualiza lista principal
    }
  });

  inputPesquisa.addEventListener("input", () => {
    const termo = inputPesquisa.value.toLowerCase();
    const contatos = document.querySelectorAll(".contato");

    contatos.forEach((contato) => {
      const nome = contato.querySelector("h1").textContent.toLowerCase();
      const telefone = contato.querySelector("h2").textContent.toLowerCase();
      const email = contato.querySelector("h3").textContent.toLowerCase();

      if (nome.includes(termo) || telefone.includes(termo) || email.includes(termo)) {
        contato.style.display = "block";
      } else {
        contato.style.display = "none";
      }
    });
  });

  btnVerLixeira.addEventListener("click", async () => {
    const response = await fetch("/lixeira");
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
        `;

        lixeiraContatos.appendChild(div);
      });
    }

    lixeiraContatos.style.display = "block";
  });

  carregarContatos();
});


 // Efeito vagalumes (inalterado)
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