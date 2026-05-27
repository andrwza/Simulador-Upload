#include <stdio.h>
#define TAM 5

typedef struct {
    int dados[TAM];
    int inicio;
    int fim;
} Fila;

Fila fila;

// Inicializa fila
void inicializarFila() {
    fila.inicio = 0;
    fila.fim = -1;
}

// Verifica se fila está vazia
int filaVazia() {
    return (fila.inicio > fila.fim);
}

// Adiciona elemento
void enfileirar(int valor) {
    fila.fim++;
    fila.dados[fila.fim] = valor;
    printf("Valor %d inserido na fila\n", valor);
}

// Remove elemento
int desenfileirar() {
    if(filaVazia()) {
        printf("Fila vazia\n");
        return -1;
    }
    
    int valor = fila.dados[fila.inicio];
    fila.inicio++;
    
    return valor;
}

// Exibe fila
void exibirFila() {
    int i;

    printf("Fila: ");
    for(i = fila.inicio; i <= fila.fim; i++) {
        printf("%d ", fila.dados[i]);
    }

    printf("\n");
}

int main() {
    inicializarFila();
    enfileirar(10);
    enfileirar(20);
    enfileirar(30);
    
    exibirFila();

    printf("Removido: %d\n", desenfileirar());

    exibirFila();

    return 0;
}
