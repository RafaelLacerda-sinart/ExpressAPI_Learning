# Projeto Exemplo Node.js

Este projeto é um exemplo de como estruturar um **`package.json`** e entender seus conceitos básicos.

---

## Conceitos Básicos do `package.json`

O `package.json` é o arquivo central de projetos Node.js e JavaScript. Ele gerencia:

- **Metadados do projeto** (nome, versão, descrição, autor, licença)  
- **Dependências** (pacotes necessários em produção e desenvolvimento)  
- **Scripts** (comandos customizados para facilitar execução de tarefas)  

### Principais Campos

1. name: Define o nome do projeto ou pacote.
```  "name": "meu-projeto"

2. version: Versão atual do projeto
``` "version": "1.0.0"

3. description: Pequena descrição do projeto.
``` "description": "Um projeto de exemplo em Node.js"

4. main: Arquivo de entrada do projeto.
  "main": "index.js"

5. scripts: Comandos customizados que podem ser executados com npm run
"scripts": {
  "start": "node index.js",
  "test": "jest"
}

6. dependencies: Pacotes que seu projeto precisa para rodar em produção.
"dependencies": {
  "express": "^4.18.2"
}

7. devDependencies: Pacotes usados apenas no desenvolvimento (testes, lint, build tools).
"devDependencies": {
  "jest": "^29.0.0",
  "eslint": "^8.50.0"
}

8. keywords: Palavras-chave que ajudam a encontrar seu projeto no npm.
"keywords": ["nodejs", "exemplo", "tutorial"]

9. author: Nome do autor do projeto
"author": "Seu Nome"

10. license: Tipo de licença do projeto.
"license": "MIT"

11. repository: Informações sobre o repositório do projeto.
"repository": {
  "type": "git",
  "url": "https://github.com/seunome/meu-projeto.git"
}

12. bugs: Onde reportar problemas do projeto.
"bugs": {
  "url": "https://github.com/seunome/meu-projeto/issues"
}

13. homepage: Página inicial ou documentação do projeto.
"homepage": "https://github.com/seunome/meu-projeto#readme"