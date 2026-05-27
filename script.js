//  FILA — baseada no conceito em C
// Criando uma fila com dados, com um começo e fim
let fila = {
    dados: [], // Onde os arquivos vão ficar guardados
    inicio: 0, // Indica "aponta" para o primeiro item da fila
    fim: -1 // Indica o último item da fila (-1 porque ainda não tem nenhum elemento dentro dele)
};

// Função para zerar a fila, para voltar para o estado incial
function inicializarFila() {
    fila.inicio = 0;
    fila.fim = -1;
}

// Função para verificar se a fila está vazia 
function filaVazia() {
    return fila.inicio > fila.fim; // Se o início passar do final, não tem nada na fila
} // Retorna True - Está vazia ou False - Tem itens

// Adiciona um item no final da fila
function enfileirar(valor) {
    fila.fim++; // Anda uma posição
    fila.dados[fila.fim] = valor; // Guarda o valor nessa posição
}

// Se a fila estiver vazia
function desenfileirar() {
    if (filaVazia()) return null; // Não tem o que tirar, então retorna NULL
    let valor = fila.dados[fila.inicio]; // Pega o primerio item da fila (o mais antigo da fila) 
    fila.inicio++; // Move o início para fretne 
    return valor; // Retorna o valor que foi removido 
}

//  Controle da Interface
let processando = false;   // Processametno - Mostra o upload do arquivo
let totalDone   = 0;       // Conta quantos arquivos já formam conclídos 

//  Essa função é chamada quando o usuário manda um arquivo 
function adicionarUpload() {
    const input = document.getElementById("arquivo"); // Coleta o campo onde o usuário digitou o nome 
    const nome  = input.value.trim(); // Remove os espeçços 

    if (nome === "") { // Caso o usuário tente realizar o upload sem arquivos no campo // ACREDITO QUE SEJA OPCIONAL
        alert("Digite o nome do arquivo"); // Recebe alerta 
        return;
    }

    // Coloca o nome do arquivo na fila 
    enfileirar(nome);

    // Aparece as infomrações dos arquivos na tela
    renderizarFila();

    // Limpa o campo 
    input.value = ""; 
    input.focus();
    setStatus("idle"); // Atualiza o status da interface 
}

// Enter também adiciona // ACREDITO QUE SEJA OPCIONAL
document.getElementById("arquivo").addEventListener("keydown", e => {
    if (e.key === "Enter") adicionarUpload();
});


//  Renderiza todos os cards da fila (Parte Esquerda)
// Desenha a fila na tela 
function renderizarFila() {
    // Container dos cards e mensagem de "fila vazia" // talvez seja opcional
    const container = document.getElementById("cards-fila"); 
    const vazio     = document.getElementById("fila-vazia");

    // Remove todos os cards antigos // tlaves seja opcional 
    Array.from(container.querySelectorAll(".card-arquivo-fila")).forEach(el => el.remove());

    // Se estiver vazia apresenta a mensgaem na tela 
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
