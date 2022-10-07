<h1 align="center">

![U4C](https://raw.githubusercontent.com/newerton/u4c-test-vehicle-protection/main/images/logo.png)

  <a>
    Teste de Processo Seletivo
  </a>
</h1>

## Modele um sistema para uma empresa de proteção veicular.

- Nesse sistema existem clientes e terceiros.
- Os clientes podem criar uma conta inserindo informações básicas de cadastro.
- Os clientes podem editar alguns dados cadastrados.
- Os clientes podem criar um evento de acidente, onde será possível informar o veículo envolvido no acidente e o(s) terceiro(s).
- Os terceiros são cadastrados quando é criado um acidente, se não houver um registro prévio na base de dados.
- Todos os usuários(clientes e terceiros) precisam ter documentos associados as suas contas.
- Quando houver o cadastro de um cliente que já foi envolvido como terceiro em um acidente, é preciso migrar o usuário para cliente sem perder o vínculo criado no acidente.

Crie uma API RESTful em NodeJS com as seguintes tecnologias:

- Typescript
- HapiJS
- TypeORM
- PostgresSQL
- Jest

---

## Requisitos a questionar

1. E-mail é obrigatório?
2. O acesso à um futuro Dashboard será por email ou documento?
3. O usuário poderá editar os dados do acidente?
4. Será cadastrado o veículo dos terceiros?

Obs.: Removido o módulo de autenticação e autorização, o user_id do Evento de Acidente, será inserido no payload do endpoint.

## TODO

1. Verificar pela placa do veículo, se ja houve uma ocorrência em X tempo, para que o usuário não insira novamente o mesmo registro de acidente.
2. Adicionar o módulo de autenticação e autorização, para que não seja passado por payload o user_id

# Test

### Requisitos

- Instalar o Docker (Unix) ou o Docker Desktop (Windows) ou o Rancher Desktop (Windows)

Com o docker instalado, precisamo subir um container do banco de dados PostgreSQL

```cli
docker-composer up -d
```

Após a conclusão, instale as dependências
```cli
npm i
```

Executando os testes com a biblioteca jest usando o compilador SWC da Vercel

```cli
npm run test
```

Executando os testes com relatório do coverage

```cli
npm run test:cov
```

Resultados
```
Test Suites: 3 passed, 3 total
Tests:       110 passed, 110 total
Snapshots:   0 total
Time:        11.623 s, estimated 12 s
```

### Endpoints

| method | path               | description                 |
| ------ | ------------------ | --------------------------- |
| GET    | /v1/accidents      | Returns all accident events |
| POST   | /v1/accidents      | Create a accident event     |
| GET    | /v1/accidents/{id} | Returns a accident event    |
| PUT    | /v1/accidents/{id} | Update a new accident event |
| GET    | /v1/users          | Returns all users           |
| POST   | /v1/users          | Creates a new user          |
| GET    | /v1/users/{id}     | Returns a user              |
| PUT    | /v1/users/{id}     | Update a new user           |

## Ambiente de desenvolvimento

Copiar o arquivo `.env.example` para `.env`, e alterar as configurações, caso tenha feita alguma alteração no dados do `docker-compose.yaml`
```cli
cp .env.example .env
```
Executar o migration do banco de dados

```cli
npm run typeorm migration:run -- -d .\src\database\typeorm\datasource.ts
```

Executando a aplicação
```cli
npm run start
```
