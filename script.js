let fila = {
    dados: [],
    inicio: 0,
    fim: -1
};

function inicializarFila() {
    fila.inicio = 0;
    fila.fim = -1;
}

function filaVazia() {
    return fila.inicio > fila.fim;
}

function enfileirar(valor) {
    fila.fim++;
    fila.dados[fila.fim] = valor;
}

function desenfileirar() {
    if (filaVazia()) return null;
    let valor = fila.dados[fila.inicio];
    fila.inicio++;
    return valor;
}

let processando = false;
let totalConcluidos = 0;

function adicionarArquivo() {
    const campo = document.getElementById("arquivo");
    const nome  = campo.value.trim();

    if (nome === "") {
        alert("Digite o nome do arquivo");
        return;
    }

    enfileirar(nome);

    renderizarFila();

    campo.value = "";
    campo.focus();
}

document.getElementById("arquivo").addEventListener("keydown", e => {
    if (e.key === "Enter") adicionarArquivo();
});

function renderizarFila() {
    const container = document.getElementById("cartoes-fila");
    const msgVazia  = document.getElementById("fila-vazia");

    Array.from(container.querySelectorAll(".cartao-arquivo")).forEach(el => el.remove());

    if (filaVazia()) {
        msgVazia.style.display = "";
        return;
    }

    msgVazia.style.display = "none";

    for (let i = fila.inicio; i <= fila.fim; i++) {
        const posicao  = i - fila.inicio + 1;
        const ehAtivo  = (i === fila.inicio && processando);

        const cartao = document.createElement("div");
        cartao.className = "cartao-arquivo" + (ehAtivo ? " ativo" : "");
        cartao.id = "cartao-" + i;

        cartao.innerHTML = `
            <div class="cabecalho-cartao">
                <span class="numero-cartao">${posicao}</span>
                <span class="nome-arquivo">${fila.dados[i]}</span>
            </div>
            <div class="barra-progresso">
                <div class="barra-preenchida" id="barra-${i}"></div>
            </div>
        `;
        container.appendChild(cartao);
    }
}

function processarUpload() {
    if (processando) return;
    if (filaVazia()) {
        alert("A fila está vazia! Adicione arquivos primeiro.");
        return;
    }

    const nomeAtual = fila.dados[fila.inicio];
    const indiceAtual = fila.inicio;

    processando = true;
    renderizarFila();

    let porcentagem = 0;

    const intervalo = setInterval(() => {
        porcentagem += 5;

        const barra = document.getElementById("barra-" + indiceAtual);
        if (barra) barra.style.width = porcentagem + "%";

        if (porcentagem >= 100) {
            clearInterval(intervalo);

            desenfileirar();

            registrarConcluido(nomeAtual);

            processando = false;
            renderizarFila();

            if (!filaVazia()) {
                setTimeout(() => processarUpload(), 400);
            }
        }
    }, 150);
}

function registrarConcluido(nome) {
    totalConcluidos++;
    document.getElementById("historico-vazio").style.display = "none";

    const lista = document.getElementById("lista-concluidos");

    const cartao = document.createElement("div");
    cartao.className = "cartao-concluido";
    cartao.innerHTML = `
        <span class="numero-concluido">${totalConcluidos}</span>
        <span class="nome-concluido">${nome}</span>
    `;

    lista.insertBefore(cartao, lista.firstChild);
}

inicializarFila();