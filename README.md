# Simulador-Upload
Simulador visual de uma fila de upload de arquivos, desenvolvido como projeto acadêmico final do 3º semestre do curso de TSI(Tecnologia em Sistemas para Internet). A interface permite adicionar arquivos a uma fila, processá-los um a um e acompanhar o histórico de uploads concluídos apresentando conceitos de estrutura de dados.

---

## Sobre o projeto
 
O projeto tem duas camadas complementares:
 
- **Interface web** (`index.html`, `script.js`, `style.css`): simulação de uma fila de uploads com visual em tempo real.
- **Implementação relacionadaa a C** (`fila.c`, `filav2.c`): estrutura de dados de fila estática implementada em JS, com fundamentos da estrura desenvolvida em C, usada como base conceitual para o comportamento da interface.
A lógica de fila segue o princípio **FIFO** (First In, First Out), o primeiro arquivo adicionado é o primeiro a ser processado até que chegue ao fim da fila.

## Tecnologias
 
- HTML5
- CSS3
- JavaScript (vanilla)
- C (Fundamentos da estrutura **fila** para base)