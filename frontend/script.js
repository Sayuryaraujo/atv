let eventos = [];
let usuarios = [];
let inscricoes = [];

let eventoEditando = null;
let usuarioEditando = null;

const $ = (id) => document.getElementById(id);
const val = (id) => $(id).value;

window.addEventListener("DOMContentLoaded", init);

async function init() {
    await carregarEventos();
    await carregarUsuarios();
    await carregarInscricoes();
    mostrarPagina("home");
}

function mostrarPagina(pagina) {

    ["home", "eventos", "usuarios", "inscricoes"].forEach(p => {
        $(p).style.display = "none";
    });

    $(pagina).style.display = "block";

    atualizarHome();
}

function atualizarHome() {

    $("resumo").innerHTML = `
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
}

async function carregarEventos() {
    const res = await fetch("http://localhost:3000/eventos/listar");
    eventos = await res.json();
    renderEventos();
}

function renderEventos() {

    let html = "";

    eventos.forEach(e => {

        html += `
        <div class="card-evento">
            <h3>${e.titulo}</h3>
            <p>${new Date(e.data_evento).toLocaleDateString()}</p>
            <p>${e.local}</p>

            <button onclick="excluirEvento(${e.id})">Excluir</button>
        </div>`;
    });

    $("lista-eventos").innerHTML = html;
}

window.excluirEvento = async function (id) {

    await fetch(`http://localhost:3000/eventos/excluir/${id}`, {
        method: "DELETE"
    });

    await carregarEventos();
}

async function carregarUsuarios() {
    const res = await fetch("http://localhost:3000/usuarios/listar");
    usuarios = await res.json();
    renderUsuarios();
}

function renderUsuarios() {

    let html = "";

    usuarios.forEach(u => {

        html += `
        <tr>
            <td>${u.nome}</td>
            <td>${u.email}</td>
            <td>${u.telefone || ""}</td>
            <td>
                <button onclick="excluirUsuario(${u.id})">Excluir</button>
            </td>
        </tr>`;
    });

    $("tbody-usuarios").innerHTML = html;
}

window.excluirUsuario = async function (id) {

    await fetch(`http://localhost:3000/usuarios/excluir/${id}`, {
        method: "DELETE"
    });

    await carregarUsuarios();
}

async function carregarInscricoes() {
    const res = await fetch("http://localhost:3000/incricoes/listar");
    inscricoes = await res.json();
    renderInscricoes();
}

function renderInscricoes() {

    let html = "";

    inscricoes.forEach(i => {

        html += `
        <tr>
            <td>${i.usuarios?.nome || "Sem usuário"}</td>
            <td>${i.eventos?.titulo || "Sem evento"}</td>
            <td>${i.status}</td>
        </tr>`;
    });

    $("tbody-inscricoes").innerHTML = html;
}

window.salvarInscricao = async function () {

    const data = {
        usuariosId: Number(val("ins-usuario")),
        eventosId: Number(val("ins-evento")),
        status: val("ins-status")
    };

    await fetch("http://localhost:3000/incricoes/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    await carregarInscricoes();
}

window.abrirModalEvento = function (id) {

    $("modal-evento").style.display = "flex";

    if (!id) {
        eventoEditando = null;
        return;
    }

    eventoEditando = id;

    const e = eventos.find(x => x.id == id);

    $("ev-nome").value = e.titulo;
    $("ev-desc").value = e.descricao;
    $("ev-data").value = e.data_evento.split("T")[0];
    $("ev-local").value = e.local;
    $("ev-capacidade").value = e.capacidade_maxima;
}

window.salvarEvento = async function () {

    const data = {
        titulo: val("ev-nome"),
        descricao: val("ev-desc"),
        data_evento: val("ev-data"),
        local: val("ev-local"),
        capacidade_maxima: Number(val("ev-capacidade"))
    };

    const url = eventoEditando
        ? `http://localhost:3000/eventos/atualizar/${eventoEditando}`
        : `http://localhost:3000/eventos/cadastrar`;

    const method = eventoEditando ? "PUT" : "POST";

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    await carregarEventos();
}

window.abrirModalUsuario = function (id) {

    $("modal-usuario").style.display = "flex";

    if (!id) {
        usuarioEditando = null;
        return;
    }

    usuarioEditando = id;

    const u = usuarios.find(x => x.id == id);

    $("us-nome").value = u.nome;
    $("us-email").value = u.email;
    $("us-telefone").value = u.telefone;
}

window.salvarUsuario = async function () {

    const data = {
        nome: val("us-nome"),
        email: val("us-email"),
        telefone: val("us-telefone")
    };

    const url = usuarioEditando
        ? `http://localhost:3000/usuarios/atualizar/${usuarioEditando}`
        : `http://localhost:3000/usuarios/cadastrar`;

    const method = usuarioEditando ? "PUT" : "POST";

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    await carregarUsuarios();
}

window.fecharModalEvento = () => $("modal-evento").style.display = "none";
window.fecharModalUsuario = () => $("modal-usuario").style.display = "none";