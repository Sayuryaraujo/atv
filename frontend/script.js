var eventos = JSON.parse(localStorage.getItem("eventos")) || [];
var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
var inscricoes = JSON.parse(localStorage.getItem("inscricoes")) || [];

var eventoEditando = null;
var usuarioEditando = null;
var inscricaoEditando = null;

function salvarDados() {
    localStorage.setItem("eventos", JSON.stringify(eventos));
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("inscricoes", JSON.stringify(inscricoes));
}
function gerarId() {
    return Date.now();
}
function mostrarPagina(nomePagina) {

    document.getElementById("home").style.display = "none";
    document.getElementById("eventos").style.display = "none";
    document.getElementById("usuarios").style.display = "none";
    document.getElementById("inscricoes").style.display = "none";

    document.getElementById(nomePagina).style.display = "block";

    atualizarHome();
    renderEventos();
    renderUsuarios();
    renderInscricoes();
}
function atualizarHome() {

    document.getElementById("resumo").innerHTML = `
        <div class="card-resumo">
            <div class="numero">${eventos.length}</div>
            <div class="label">Eventos</div>
        </div>

        <div class="card-resumo">
            <div class="numero">${usuarios.length}</div>
            <div class="label">Usuários</div>
        </div>

        <div class="card-resumo">
            <div class="numero">${inscricoes.length}</div>
            <div class="label">Inscrições</div>
        </div>
    `;

    let html = "";

    for (let i = 0; i < eventos.length; i++) {

        html += `
        <div class="card-evento">
            <div class="info">
                <h3>${eventos[i].nome}</h3>
                <p>${eventos[i].data}</p>
                <p>${eventos[i].local}</p>
            </div>
        </div>
        `;
    }

    document.getElementById("home-eventos").innerHTML = html;
}
function abrirModalEvento(id) {

    document.getElementById("modal-evento").style.display = "flex";

    if (id == null) {

        eventoEditando = null;

        document.getElementById("ev-nome").value = "";
        document.getElementById("ev-desc").value = "";
        document.getElementById("ev-data").value = "";
        document.getElementById("ev-local").value = "";
        document.getElementById("ev-capacidade").value = "";
        document.getElementById("ev-categoria").value = "Tecnologia";
        document.getElementById("ev-imagem").value = "";

        return;
    }

    eventoEditando = id;

    let evento = eventos.find(e => e.id == id);

    document.getElementById("ev-nome").value = evento.nome;
    document.getElementById("ev-desc").value = evento.descricao;
    document.getElementById("ev-data").value = evento.data;
    document.getElementById("ev-local").value = evento.local;
    document.getElementById("ev-capacidade").value = evento.capacidade;
    document.getElementById("ev-categoria").value = evento.categoria;
    document.getElementById("ev-imagem").value = evento.imagem;
}
function fecharModalEvento() {
    document.getElementById("modal-evento").style.display = "none";
}
function salvarEvento() {

    let nome = document.getElementById("ev-nome").value;

    if (nome == "") {
        alert("Digite o nome do evento.");
        return;
    }

    let evento = {
        id: eventoEditando || gerarId(),
        nome: nome,
        descricao: document.getElementById("ev-desc").value,
        data: document.getElementById("ev-data").value,
        local: document.getElementById("ev-local").value,
        capacidade: document.getElementById("ev-capacidade").value,
        categoria: document.getElementById("ev-categoria").value,
        imagem: document.getElementById("ev-imagem").value
    };

    if (eventoEditando == null) {
        eventos.push(evento);
    } else {
        let indice = eventos.findIndex(e => e.id == eventoEditando);
        eventos[indice] = evento;
    }

    salvarDados();
    fecharModalEvento();
    renderEventos();
}
function excluirEvento() {

    if (!confirm("Excluir evento?")) return;

    eventos = eventos.filter(e => e.id != eventoEditando);

    salvarDados();
    fecharModalEvento();
    renderEventos();
}
function renderEventos() {

    let busca = document.getElementById("busca-evento").value.toLowerCase();

    let html = "";

    for (let i = 0; i < eventos.length; i++) {

        let evento = eventos[i];

        if (!evento.nome.toLowerCase().includes(busca)) {
            continue;
        }

        html += `
    <div class="card-evento">

    <img src="${eventos[i].imagem}" 
         alt="${eventos[i].nome}" 
         class="img-evento">

    <div class="info">
        <h3>${eventos[i].nome}</h3>
        <p>${eventos[i].data}</p>
        <p>${eventos[i].local}</p>
    </div>

    </div>
`;
    }

    document.getElementById("lista-eventos").innerHTML = html;
}
function abrirModalUsuario(id) {

    document.getElementById("modal-usuario").style.display = "flex";

    if (id == null) {

        usuarioEditando = null;

        document.getElementById("us-nome").value = "";
        document.getElementById("us-email").value = "";
        document.getElementById("us-telefone").value = "";

        return;
    }

    usuarioEditando = id;

    let usuario = usuarios.find(u => u.id == id);

    document.getElementById("us-nome").value = usuario.nome;
    document.getElementById("us-email").value = usuario.email;
    document.getElementById("us-telefone").value = usuario.telefone;
}
function fecharModalUsuario() {
    document.getElementById("modal-usuario").style.display = "none";
}
function salvarUsuario() {

    let usuario = {
        id: usuarioEditando || gerarId(),
        nome: document.getElementById("us-nome").value,
        email: document.getElementById("us-email").value,
        telefone: document.getElementById("us-telefone").value
    };

    if (usuarioEditando == null) {
        usuarios.push(usuario);
    } else {

        let indice = usuarios.findIndex(u => u.id == usuarioEditando);
        usuarios[indice] = usuario;
    }

    salvarDados();
    fecharModalUsuario();
    renderUsuarios();
}
function excluirUsuario() {

    if (!confirm("Excluir usuário?")) return;

    usuarios = usuarios.filter(u => u.id != usuarioEditando);

    salvarDados();
    fecharModalUsuario();
    renderUsuarios();
}
function renderUsuarios() {

    let busca = document.getElementById("busca-usuario").value.toLowerCase();

    let html = "";

    for (let i = 0; i < usuarios.length; i++) {

        let usuario = usuarios[i];

        if (
            !usuario.nome.toLowerCase().includes(busca) &&
            !usuario.email.toLowerCase().includes(busca)
        ) {
            continue;
        }

        html += `
        <tr>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefone}</td>
            <button class="btn-acao"
                onclick="abrirModalUsuario(${usuario.id})">
                Editar
            </button>
        </tr>
        `;
    }

    document.getElementById("tbody-usuarios").innerHTML = html;
}
function abrirModalInscricao(id) {

    document.getElementById("modal-inscricao").style.display = "flex";

    let selectUsuario = document.getElementById("ins-usuario");
    let selectEvento = document.getElementById("ins-evento");

    selectUsuario.innerHTML = "";
    selectEvento.innerHTML = "";

    usuarios.forEach(usuario => {
        selectUsuario.innerHTML += `
        <option value="${usuario.id}">
            ${usuario.nome}
        </option>`;
    });

    eventos.forEach(evento => {
        selectEvento.innerHTML += `
        <option value="${evento.id}">
            ${evento.nome}
        </option>`;
    });

    inscricaoEditando = id;
}
function fecharModalInscricao() {
    document.getElementById("modal-inscricao").style.display = "none";
}
function salvarInscricao() {

    let usuarioId = document.getElementById("ins-usuario").value;
    let eventoId = document.getElementById("ins-evento").value;
    let status = document.getElementById("ins-status").value;

    let usuario = usuarios.find(u => u.id == usuarioId);
    let evento = eventos.find(e => e.id == eventoId);

    let inscricao = {
        id: gerarId(),
        usuarioNome: usuario.nome,
        usuarioEmail: usuario.email,
        eventoNome: evento.nome,
        status: status
    };

    inscricoes.push(inscricao);

    salvarDados();
    fecharModalInscricao();
    renderInscricoes();
}
function excluirInscricao() {
    fecharModalInscricao();
}
function renderInscricoes() {

    let html = "";

    for (let i = 0; i < inscricoes.length; i++) {

        let inscricao = inscricoes[i];

        html += `
        <tr>
            <td>${inscricao.usuarioNome}</td>
            <td>${inscricao.eventoNome}</td>
            <td>${inscricao.status}</td>
        </tr>
        `;
    }
    document.getElementById("tbody-inscricoes").innerHTML = html;
}
mostrarPagina("home");