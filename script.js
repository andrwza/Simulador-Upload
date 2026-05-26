// FILA baseada no conceito em C

let fila = {
    dados: [],
    inicio: 0,
    fim: -1
};

// Inicializar fila
function inicializarFila() {

    fila.inicio = 0;
    fila.fim = -1;
}

// Verifica se fila está vazia
function filaVazia() {

    return fila.inicio > fila.fim;
}

// Adiciona elemento na fila
function enfileirar(valor) {

    fila.fim++;

    fila.dados[fila.fim] = valor;
}

// Remove elemento da fila
function desenfileirar() {

    if(filaVazia()) {

        return null;
    }

    let valor = fila.dados[fila.inicio];

    fila.inicio++;

    return valor;
}

// Adicionar upload
function adicionarUpload() {

    const input = document.getElementById("arquivo");

    const nomeArquivo = input.value;

    if(nomeArquivo == "") {

        alert("Digite um arquivo");

        return;
    }

    enfileirar(nomeArquivo);

    atualizarFila();

    input.value = "";
}

// Atualiza fila na tela
function atualizarFila() {

    const lista = document.getElementById("fila");

    lista.innerHTML = "";

    for(let i = fila.inicio; i <= fila.fim; i++) {

        let item = document.createElement("li");

        item.textContent = fila.dados[i];

        lista.appendChild(item);
    }
}

// Processa upload
function processarUpload() {

    const arquivoAtual = desenfileirar();

    if(arquivoAtual == null) {

        alert("Fila vazia");

        return;
    }

    atualizarFila();

    const progresso = document.getElementById("progresso");

    const status = document.getElementById("status");

    let porcentagem = 0;

    status.textContent = `Enviando ${arquivoAtual}`;

    let intervalo = setInterval(() => {

        porcentagem += 10;

        progresso.style.width = porcentagem + "%";

        if(porcentagem >= 100) {

            clearInterval(intervalo);

            status.textContent = `${arquivoAtual} enviado com sucesso`;

            setTimeout(() => {

                progresso.style.width = "0%";

                status.textContent = "Nenhum upload em andamento";

            }, 2000);
        }

    }, 300);
}

// Inicializa fila
inicializarFila();