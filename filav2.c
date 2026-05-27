#include <stdio.h>
#include <string.h>
#define TAM 5

typedef struct {
    char dados[TAM][50];
    int inicio;
    int fim;
} Fila;

Fila fila;

void inicializarFila() {
    fila.inicio = 0;
    fila.fim = -1;
}

void enfileirar(char nome[]) {
    if (fila.fim == TAM - 1) {
        printf("Fila cheia!\n");
        return;
    }

    fila.fim++;
    strcpy(fila.dados[fila.fim], nome);
}

char* desenfileirar() {
    static char nome[50];

    if (fila.inicio > fila.fim) {
        return NULL;
    }

    strcpy(nome, fila.dados[fila.inicio]);
    fila.inicio++;

    return nome;
}

void processarUploads() {
    while (fila.inicio <= fila.fim) {
        char *arquivo = desenfileirar();
        printf("Enviando: %s\n", arquivo);
        printf("Upload concluído!\n");
    }
}
