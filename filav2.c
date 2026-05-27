#include <stdio.h>
#include <string.h>
#include <unistd.h> // para sleep()

#define TAM 5

typedef struct {
    char dados[TAM][50]; // nomes dos arquivos
    int inicio;
    int fim;
} Fila;

Fila fila;

// Inicializa fila
void inicializarFila() {
    fila.inicio = 0;
    fila.fim = -1;
}

// Verifica se está vazia
int filaVazia() {
    return (fila.inicio > fila.fim);
}

// Verifica se está cheia
int filaCheia() {
    return (fila.fim == TAM - 1);
}

// Adiciona upload
void enfileirar(char nome[]) {
    if (filaCheia()) {
        printf("Fila cheia!\n");
        return;
    }

    fila.fim++;
    strcpy(fila.dados[fila.fim], nome);

    printf("Upload '%s' adicionado à fila\n", nome);
}

// Remove upload
char* desenfileirar() {
    static char nome[50];

    if (filaVazia()) {
        printf("Fila vazia!\n");
        return NULL;
    }

    strcpy(nome, fila.dados[fila.inicio]);
    fila.inicio++;

    return nome;
}

// Mostrar fila
void mostrarFila() {
    printf("\nFila atual:\n");

    for (int i = fila.inicio; i <= fila.fim; i++) {
        printf("%d - %s\n", i - fila.inicio + 1, fila.dados[i]);
    }

    if (filaVazia()) {
        printf("Fila vazia...\n");
    }
}

// Simular upload
void processarUploads() {
    if (filaVazia()) {
        printf("Nada para processar!\n");
        return;
    }

    while (!filaVazia()) {
        char *arquivo = desenfileirar();

        printf("\nEnviando: %s\n", arquivo);

        // Simula progresso
        for (int i = 0; i <= 100; i += 20) {
            printf("Progresso: %d%%\n", i);
            sleep(1);
        }

        printf("Upload de '%s' concluído!\n", arquivo);
    }
}
