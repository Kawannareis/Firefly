const API_URL = 'http://localhost:3000';
          
  let contatoEditando = null;
          
  // Ao carregar, busca contatos do backend
      window.onload = async () => {
    await carregarContatos();
            document.getElementById('pesquisarContato').addEventListener('input', filtrarContatos);
            document.getElementById('criarContato').addEventListener('click', () => {
              document.getElementById('formContato').style.display = 'block';
            });
            document.getElementById('fecharFormulario').addEventListener('click', () => {
              document.getElementById('formContato').style.display = 'none';
             });
            document.getElementById('salvarContato').addEventListener('click', salvarOuAtualizarContato);
          };
          
            async function carregarContatos() {
              const res = await fetch(`${API_URL}/contatos`);
              const contatos = await res.json();
              const container = document.querySelector('.container');
              container.innerHTML = '';
          
              contatos.forEach(contato => {
                const div = document.createElement('div');
                div.classList.add('contato');
                div.dataset.id = contato.id;
                div.innerHTML = `
                  <h1>Nome: ${contato.nome}</h1>
                  <h2>Telefone: ${contato.telefone}</h2>
                  <h3>Email: ${contato.email}</h3>
                  <button class="excluirContato">X</button>
                  <button class="editarContato">Editar</button>
                `;
                container.appendChild(div);
              });
          
              aplicarEventosEdicao();
              aplicarEventosExcluir();
            }
          
            function filtrarContatos() {
              const termo = this.value.toLowerCase();
              document.querySelectorAll('.contato').forEach(contato => {
                const nome = contato.querySelector('h1').textContent.toLowerCase();
                contato.style.display = nome.includes(termo) ? 'block' : 'none';
              });
            }
          
            async function salvarOuAtualizarContato() {
              const nome = document.getElementById('nome').value.trim();
              const telefone = document.getElementById('telefone').value.trim();
              const email = document.getElementById('email').value.trim();
          
              if (!nome || !telefone || !email) {
                alert('Preencha todos os campos!');
                return;
              }
          
              if (contatoEditando) {
                const id = contatoEditando.dataset.id;
                await fetch(`${API_URL}/contatos/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ nome, telefone, email })
                });
              } else {
                await fetch(`${API_URL}/contatos`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ nome, telefone, email })
                });
              }
          
              contatoEditando = null;
              limparFormulario();
              await carregarContatos();
              mostrarMensagemSucesso();
            }
          
            function aplicarEventosEdicao() {
              document.querySelectorAll('.editarContato').forEach(btn => {
                btn.onclick = () => {
                  contatoEditando = btn.closest('.contato');
                  document.getElementById('nome').value = contatoEditando.querySelector('h1').textContent.replace('Nome: ', '');
                  document.getElementById('telefone').value = contatoEditando.querySelector('h2').textContent.replace('Telefone: ', '');
                  document.getElementById('email').value = contatoEditando.querySelector('h3').textContent.replace('Email: ', '');
                  document.getElementById('salvarContato').textContent = 'Atualizar Contato';
                  document.getElementById('formContato').style.display = 'block';
                };
              });
            }
          
            function aplicarEventosExcluir() {
              document.querySelectorAll('.excluirContato').forEach(btn => {
                btn.onclick = async () => {
                  if (confirm('Tem certeza que deseja excluir este contato?')) {
                    const contato = btn.closest('.contato');
                    const id = contato.dataset.id;
                    await fetch(`${API_URL}/contatos/${id}`, { method: 'DELETE' });
                    await carregarContatos();
                    mostrarMensagemSucesso();
                  }
                };
              });
            }
          
            function limparFormulario() {
              document.getElementById('formContato').reset();
              document.getElementById('formContato').style.display = 'none';
              document.getElementById('salvarContato').textContent = 'Salvar Contato';
            }
          
            function mostrarMensagemSucesso() {
              const msg = document.getElementById('mensagemSucesso');
              msg.style.display = 'block';
              msg.style.opacity = '1';
              setTimeout(() => {
                msg.style.opacity = '0';
                setTimeout(() => msg.style.display = 'none', 500);
              }, 3000);
            }
