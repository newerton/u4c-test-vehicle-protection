import { cnpj, cpf } from 'cpf-cnpj-validator';

export class UserFixtures {
  static invalidRequired() {
    const document = cpf.generate();
    return [
      {
        payload: {},
        expected: {
          message: '"Nome" é obrigatório',
        },
      },
      {
        payload: { first_name: 'John' },
        expected: {
          message: '"Sobrenome" é obrigatório',
        },
      },
      {
        payload: { first_name: 'John', last_name: 'Doe' },
        expected: {
          message: '"CPF" é obrigatório',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
        },
        expected: {
          message: '"Senha" é obrigatório',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
          password: '123456',
        },
        expected: {
          message: '"Repita a senha" é obrigatório',
        },
      },
    ];
  }

  static invalidCreateRequest() {
    const document = cpf.generate();
    return [
      {
        payload: {},
        expected: {
          message: '"Nome" é obrigatório',
        },
      },
      {
        payload: { first_name: null },
        expected: {
          message: '"Nome" inválido',
        },
      },
      {
        payload: { first_name: 'John', last_name: null },
        expected: {
          message: '"Sobrenome" inválido',
        },
      },
      {
        payload: { first_name: 'John', last_name: 'Doe', email: 123 },
        expected: {
          message: '"E-mail" inválido',
        },
      },
      {
        payload: { first_name: 'John', last_name: 'Doe', email: 'email' },
        expected: {
          message: '"E-mail" deve ser um e-mail válido',
        },
      },
      {
        payload: { first_name: 'John', last_name: 'Doe', email: 'email@email' },
        expected: {
          message: '"E-mail" deve ser um e-mail válido',
        },
      },
      {
        payload: { first_name: 'John', last_name: 'Doe', document: null },
        expected: {
          message: '"CPF" inválido',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document: 12345678909,
        },
        expected: {
          message: '"CPF" inválido',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document: 'abcdrfgfhijkl',
        },
        expected: {
          message: '"CPF" inválido',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
          password: null,
        },
        expected: {
          message: '"Senha" inválido',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
          password: '123',
        },
        expected: {
          message: '"Senha" deve ter no mínimo 6 caracteres',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
          password: 123,
        },
        expected: {
          message: '"Senha" inválido',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
          password: '123456',
          repeat_password: null,
        },
        expected: {
          message: '"Repita a senha" deve ser [ref:password]',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
          password: '123456',
          repeat_password: '123',
        },
        expected: {
          message: '"Repita a senha" deve ser [ref:password]',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
          password: '123456',
          repeat_password: 123,
        },
        expected: {
          message: '"Repita a senha" deve ser [ref:password]',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
          password: '123456',
          repeat_password: '123456',
          birthday: '33/10/2022',
        },
        expected: {
          message:
            'O formato da data de aniversário está incorreta, o formato é Dia/Mês/Ano.',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
          password: '123456',
          repeat_password: '123456',
          birthday: '10/10/0001',
        },
        expected: {
          message:
            'O formato da data de aniversário está incorreta, o formato é Dia/Mês/Ano.',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document,
          password: '123456',
          repeat_password: '123456',
          birthday: '10/10/1981',
          phone: '1234-5678',
        },
        expected: {
          message: 'Número de telefone inválido.',
        },
      },
    ];
  }

  static invalidUpdateRequest() {
    return [
      {
        payload: { first_name: null },
        expected: {
          message: '"Nome" inválido',
        },
      },
      {
        payload: { first_name: 'John', last_name: null },
        expected: {
          message: '"Sobrenome" inválido',
        },
      },
      {
        payload: { first_name: 'John', last_name: 'Doe', email: 123 },
        expected: {
          message: '"E-mail" inválido',
        },
      },
      {
        payload: { first_name: 'John', last_name: 'Doe', email: 'email' },
        expected: {
          message: '"E-mail" deve ser um e-mail válido',
        },
      },
      {
        payload: { first_name: 'John', last_name: 'Doe', email: 'email@email' },
        expected: {
          message: '"E-mail" deve ser um e-mail válido',
        },
      },
      {
        payload: { first_name: 'John', last_name: 'Doe', document: null },
        expected: {
          message: '"document" is not allowed',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document: 12345678909,
        },
        expected: {
          message: '"document" is not allowed',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          document: 'abcdrfgfhijkl',
        },
        expected: {
          message: '"document" is not allowed',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          password: null,
        },
        expected: {
          message: '"Senha" inválido',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          password: '123',
        },
        expected: {
          message: '"Senha" deve ter no mínimo 6 caracteres',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          password: 123,
        },
        expected: {
          message: '"Senha" inválido',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          password: '123456',
          repeat_password: null,
        },
        expected: {
          message: '"Repita a senha" deve ser [ref:password]',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          password: '123456',
          repeat_password: '123',
        },
        expected: {
          message: '"Repita a senha" deve ser [ref:password]',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          password: '123456',
          repeat_password: 123,
        },
        expected: {
          message: '"Repita a senha" deve ser [ref:password]',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          password: '123456',
          repeat_password: '123456',
          birthday: '33/10/2022',
        },
        expected: {
          message:
            'O formato da data de aniversário está incorreta, o formato é Dia/Mês/Ano.',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          password: '123456',
          repeat_password: '123456',
          birthday: '10/10/0001',
        },
        expected: {
          message:
            'O formato da data de aniversário está incorreta, o formato é Dia/Mês/Ano.',
        },
      },
      {
        payload: {
          first_name: 'John',
          last_name: 'Doe',
          password: '123456',
          repeat_password: '123456',
          birthday: '10/10/1981',
          phone: '1234-5678',
        },
        expected: {
          message: 'Número de telefone inválido.',
        },
      },
    ];
  }
}
