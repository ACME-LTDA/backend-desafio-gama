# Backend do Desafio da Gama

Para testar a aplicação, é necessário ter instalado na máquina o `nodejs` e o `docker`.

Em uma nova instalação, os seguintes passos devem ser feitos para iniciar a aplicação:

1. Baixe as dependências do projeto, para isso rodando o comando `npm install` na pasta raiz do projeto;

2. Inicie um novo container docker MySQL, com o seguinte comando (pode ser necessário rodar esse comando como sudo, dependendo de como o docker foi instalado):

`docker run --name kpmg-f1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=12345 -d mysql:8`

3. Com o docker rodando, inicie o backend com o comando `npm run start-dev`.
