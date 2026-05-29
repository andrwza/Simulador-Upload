// FILA — baseada no conceito em C
// Criando uma fila com dados, com um começo e fim
let fila = {
    dados: [],  // Onde os arquivos vão ficar guardados
    inicio: 0,  // "Aponta" para o primeiro item da fila
    fim: -1     // Indica o último item da fila (-1 porque ainda não tem nenhum elemento)
};

// Função para zerar a fila, voltando ao estado inicial
function inicializarFila() {
    fila.inicio = 0;
    fila.fim = -1;
}

// Verifica se a fila está vazia
function filaVazia() {
    return fila.inicio > fila.fim; // Se o início passar do final, não tem nada na fila
} // Retorna true - está vazia, ou false - tem itens

// Adiciona um item no final da fila
function enfileirar(valor) {
    fila.fim++;                  // Anda uma posição
    fila.dados[fila.fim] = valor; // Guarda o valor nessa posição
}

// Remove e retorna o primeiro item da fila
function desenfileirar() {
    if (filaVazia()) return null; // Não tem o que tirar, retorna null
    let valor = fila.dados[fila.inicio]; // Pega o primeiro item (o mais antigo)
    fila.inicio++;                       // Move o início para frente
    return valor;                        // Retorna o valor removido
}

// Controle da interface
let processando = false; // Indica se há um upload em andamento
let totalConcluidos = 0; // Conta quantos arquivos já foram concluídos

// Chamada quando o usuário adiciona um arquivo à fila
function adicionarArquivo() {
    const campo = document.getElementById("arquivo"); // Campo onde o usuário digitou o nome
    const nome  = campo.value.trim();                 // Remove espaços extras

    if (nome === "") {
        alert("Digite o nome do arquivo");
        return;
    }

    // Coloca o arquivo na fila
    enfileirar(nome);

    // Atualiza a tela
    renderizarFila();

    // Limpa o campo
    campo.value = "";
    campo.focus();
}

// Enter também adiciona o arquivo
document.getElementById("arquivo").addEventListener("keydown", e => {
    if (e.key === "Enter") adicionarArquivo();
});

// Renderiza todos os cartões da fila (coluna esquerda)
function renderizarFila() {
    const container = document.getElementById("cartoes-fila");
    const msgVazia  = document.getElementById("fila-vazia");

    // Remove os cartões antigos antes de redesenhar
    Array.from(container.querySelectorAll(".cartao-arquivo")).forEach(el => el.remove());

    // Se a fila estiver vazia, exibe a mensagem
    if (filaVazia()) {
        msgVazia.style.display = "";
        return;
    }

    msgVazia.style.display = "none";

    for (let i = fila.inicio; i <= fila.fim; i++) {
        const posicao  = i - fila.inicio + 1;              // Posição visível (1, 2, 3…)
        const ehAtivo  = (i === fila.inicio && processando); // Primeiro da fila durante o processamento

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

// Processa o upload do primeiro arquivo da fila (FIFO)
// Regra central: só processa 1 arquivo por vez
function processarUpload() {
    if (processando) return; // Já tem um rodando, ignora
    if (filaVazia()) {
        alert("A fila está vazia! Adicione arquivos primeiro.");
        return;
    }

    // Pega o arquivo na frente da fila (sem remover ainda)
    const nomeAtual = fila.dados[fila.inicio];
    const indiceAtual = fila.inicio;

    processando = true;
    renderizarFila();

    let porcentagem = 0;

    const intervalo = setInterval(() => {
        porcentagem += 5;

        // Atualiza a barra do cartão ativo
        const barra = document.getElementById("barra-" + indiceAtual);
        if (barra) barra.style.width = porcentagem + "%";

        if (porcentagem >= 100) {
            clearInterval(intervalo);

            // Remove da fila
            desenfileirar();

            // Move para o histórico
            registrarConcluido(nomeAtual);

            processando = false;
            renderizarFila();

            // Se ainda há itens na fila, processa o próximo automaticamente
            if (!filaVazia()) {
                setTimeout(() => processarUpload(), 400);
            }
        }

    }, 150); // Velocidade da barra de progresso
}

// Move o arquivo concluído para o histórico (coluna direita)
function registrarConcluido(nome) {
    totalConcluidos++;
    document.getElementById("historico-vazio").style.display = "none";

    const hora = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });

    const lista = document.getElementById("lista-concluidos");

    const cartao = document.createElement("div");
    cartao.className = "cartao-concluido";
    cartao.innerHTML = `
        <span class="numero-concluido">${totalConcluidos}</span>
        <span class="nome-concluido">${nome}</span>
        <span class="hora-conclusao">${hora}</span>
    `;

    // Insere no topo (mais recente primeiro)
    lista.insertBefore(cartao, lista.firstChild);
}

// Init
inicializarFila();