// ================================================================
//  FILA — baseada no conceito em C
//  Estrutura: dados[], inicio, fim
// ================================================================

let fila = {
    dados: [],
    inicio: 0,
    fim: -1
};

function inicializarFila() {
    fila.inicio = 0;
    fila.fim = -1;
}

// Verifica se a fila está vazia
function filaVazia() {
    return fila.inicio > fila.fim;
}

// Adiciona elemento no fim da fila (enqueue)
function enfileirar(valor) {
    fila.fim++;
    fila.dados[fila.fim] = valor;
}

// Remove e retorna o elemento do início da fila (dequeue)
function desenfileirar() {
    if (filaVazia()) return null;
    let valor = fila.dados[fila.inicio];
    fila.inicio++;
    return valor;
}

// ================================================================
//  Estado da interface
// ================================================================

let processando = false;   // trava: só 1 arquivo por vez
let totalDone   = 0;       // contador global de concluídos

// ================================================================
//  Adicionar arquivo à fila (botão central)
// ================================================================
function adicionarUpload() {
    const input = document.getElementById("arquivo");
    const nome  = input.value.trim();

    if (nome === "") {
        alert("Digite o nome do arquivo");
        return;
    }

    // Coloca na estrutura de dados
    enfileirar(nome);

    // Atualiza os cards na tela
    renderizarFila();

    input.value = "";
    input.focus();
    setStatus("idle");
}

// Enter também adiciona
document.getElementById("arquivo").addEventListener("keydown", e => {
    if (e.key === "Enter") adicionarUpload();
});

// ================================================================
//  Renderiza todos os cards da fila (coluna esquerda)
// ================================================================
function renderizarFila() {
    const container = document.getElementById("cards-fila");
    const vazio     = document.getElementById("fila-vazia");

    // Remove cards antigos
    Array.from(container.querySelectorAll(".card-arquivo-fila")).forEach(el => el.remove());

    if (filaVazia()) {
        vazio.style.display = "";
        return;
    }

    vazio.style.display = "none";

    for (let i = fila.inicio; i <= fila.fim; i++) {
        const pos    = i - fila.inicio + 1;          // posição visível (1, 2, 3…)
        const ehAtivo = (i === fila.inicio && processando);

        const card = document.createElement("div");
        card.className = "card-arquivo-fila" + (ehAtivo ? " ativo" : "");
        card.id = "card-" + i;

        card.innerHTML = `
            <div class="card-header">
                <span class="card-num">${pos}</span>
                <span class="card-nome">${fila.dados[i]}</span>
                <span class="card-tag">${ehAtivo ? "Enviando" : "Aguardando"}</span>
            </div>
            <div class="barra-progresso">
                <div class="barra-fill" id="barra-${i}"></div>
            </div>
        `;

        container.appendChild(card);
    }
}

// ================================================================
//  Processar Upload (botão da coluna esquerda)
//  Regra central: só processa 1 arquivo por vez (FIFO)
// ================================================================
function processarUpload() {
    if (processando) return;   // já tem um rodando → ignora
    if (filaVazia()) {
        alert("A fila está vazia! Adicione arquivos primeiro.");
        return;
    }

    // Pega o arquivo na frente da fila (sem remover ainda)
    const nomeAtual = fila.dados[fila.inicio];
    const idxAtual  = fila.inicio;

    processando = true;
    renderizarFila();                          // marca card como ativo
    setStatus("processando", nomeAtual);

    let porcentagem = 0;

    const intervalo = setInterval(() => {
        porcentagem += 5;

        // Atualiza a barra do card ativo
        const barra = document.getElementById("barra-" + idxAtual);
        if (barra) barra.style.width = porcentagem + "%";

        if (porcentagem >= 100) {
            clearInterval(intervalo);

            // Remove da fila (dequeue)
            desenfileirar();

            // Move o card para o histórico
            moverParaHistorico(nomeAtual);

            processando = false;
            renderizarFila();

            // Se ainda há itens, processa o próximo automaticamente
            if (!filaVazia()) {
                setTimeout(() => processarUpload(), 400);
            } else {
                setStatus("concluido");
            }
        }

    }, 150); // velocidade da barra
}

// ================================================================
//  Move arquivo concluído para o histórico (coluna direita)
// ================================================================
function moverParaHistorico(nome) {
    totalDone++;
    document.getElementById("badge-done").textContent = totalDone;
    document.getElementById("done-vazio").style.display = "none";

    const hora = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });

    const lista = document.getElementById("lista-processados");

    const card = document.createElement("div");
    card.className = "card-historico";
    card.innerHTML = `
        <span class="hist-num">#${totalDone}</span>
        <span class="hist-check">✓</span>
        <span class="hist-nome">${nome}</span>
        <span class="hist-hora">${hora}</span>
    `;

    // Insere no topo (mais recente primeiro)
    lista.insertBefore(card, lista.firstChild);
}

// ================================================================
//  Status box (centro)
// ================================================================
function setStatus(tipo, nome) {
    const dot = document.getElementById("status-dot");
    const msg = document.getElementById("status-msg");

    if (tipo === "processando") {
        dot.className = "status-dot processando";
        msg.textContent = `Enviando: ${nome}`;
    } else if (tipo === "concluido") {
        dot.className = "status-dot concluido";
        msg.textContent = `${totalDone} arquivo(s) processado(s) com sucesso`;
    } else {
        dot.className = "status-dot";
        const qtd = filaVazia() ? 0 : (fila.fim - fila.inicio + 1);
        msg.textContent = qtd > 0 ? `${qtd} arquivo(s) na fila` : "Aguardando arquivos...";
    }
}

// ================================================================
//  Init
// ================================================================
inicializarFila();