## Modele um sistema para uma empresa de proteção veicular.

- Nesse sistema existem clientes e terceiros.
- Os clientes podem criar uma conta inserindo informações básicas de cadastro.
- Os clientes podem editar alguns dados cadastrados.
- Os clientes podem criar um evento de acidente, onde será possível informar o veículo envolvido no acidente e o(s) terceiro(s).
- Os terceiros são cadastrados quando é criado um acidente, se não houver um registro prévio na base de dados.
Todos os usuários(clientes e terceiros) precisam ter documentos associados as suas contas.
- Quando um houve o cadastro de um cliente que já foi envolvido como terceiro em um acidente, é preciso migrar o usuário para cliente sem perder o vínculo criado no acidente.

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
1. Verificar pela placa do veículo, se ja houve uma ocorrência em X tempo, para que o usuário não insira novamente o mesmo registro.
2. Adicionar o módulo de autenticação e autorização, para que não seja passado por payload o user_id
