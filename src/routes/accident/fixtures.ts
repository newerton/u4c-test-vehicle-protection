import { faker } from '@faker-js/faker/locale/pt_BR';

export class AccidentEventFixtures {
  static invalidRequired() {
    return [
      {
        payload: {},
        expected: {
          message: '"Usuário" é obrigatório',
        },
      },
      {
        payload: { user_id: faker.datatype.uuid() },
        expected: {
          message: '"Veículo" é obrigatório',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
        },
        expected: {
          message: '"Ano do veículo" é obrigatório',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
        },
        expected: {
          message: '"Placa do veículo" é obrigatório',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
        },
        expected: {
          message: '"Descrição" é obrigatório',
        },
      },
    ];
  }

  static invalidCreateRequest() {
    return [
      {
        payload: {},
        expected: {
          message: '"Usuário" é obrigatório',
        },
      },
      {
        payload: { user_id: '123' },
        expected: {
          message: '"Usuário" não existe',
        },
      },
      {
        payload: { user_id: '' },
        expected: {
          message: '"Usuário" não pode ser vazio',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: null,
        },
        expected: {
          message: '"Veículo" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: '',
        },
        expected: {
          message: '"Veículo" não pode ser vazio',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 0,
        },
        expected: {
          message: '"Ano do veículo" deve ter no mínimo 4 números',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: '',
        },
        expected: {
          message: '"Ano do veículo" deve ser números',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: '1bc',
        },
        expected: {
          message: '"Ano do veículo" deve ser números',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: null,
        },
        expected: {
          message: '"Placa do veículo" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: 123,
        },
        expected: {
          message: '"Placa do veículo" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: '',
        },
        expected: {
          message: '"Placa do veículo" não pode ser vazio',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: null,
        },
        expected: {
          message: '"Descrição" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: 123,
        },
        expected: {
          message: '"Descrição" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: '',
        },
        expected: {
          message: '"Descrição" não pode ser vazio',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(400),
        },
        expected: {
          message: '"Descrição" deve ter no máximo 2048 caracteres',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: null,
            },
          ],
        },
        expected: {
          message: '"Nome" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: '',
            },
          ],
        },
        expected: {
          message: '"Nome" não pode ser vazio',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
            },
          ],
        },
        expected: {
          message: '"Sobrenome" é obrigatório',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
              last_name: null,
            },
          ],
        },
        expected: {
          message: '"Sobrenome" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
              last_name: '',
            },
          ],
        },
        expected: {
          message: '"Sobrenome" não pode ser vazio',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
              last_name: faker.name.lastName(),
            },
          ],
        },
        expected: {
          message: 'O CPF do terceiro é obrigatório',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
              last_name: faker.name.lastName(),
              document: 12345678909,
            },
          ],
        },
        expected: {
          message: 'O CPF do terceiro inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
              last_name: faker.name.lastName(),
              document: 'abcdrfgfhijkl',
            },
          ],
        },
        expected: {
          message: 'CPF inválido',
        },
      },
    ];
  }

  static invalidUpdateRequest() {
    return [
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: null,
        },
        expected: {
          message: '"Descrição" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: 123,
        },
        expected: {
          message: '"Descrição" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: '',
        },
        expected: {
          message: '"Descrição" não pode ser vazio',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(400),
        },
        expected: {
          message: '"Descrição" deve ter no máximo 2048 caracteres',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(10),
        },
        expected: {
          message: '"user_id" is not allowed',
        },
      },
      {
        payload: {
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(10),
        },
        expected: {
          message: '"vehicle" is not allowed',
        },
      },
      {
        payload: {
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(10),
        },
        expected: {
          message: '"year" is not allowed',
        },
      },
      {
        payload: {
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(10),
        },
        expected: {
          message: '"license_plate" is not allowed',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: null,
            },
          ],
        },
        expected: {
          message: '"Nome" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: '',
            },
          ],
        },
        expected: {
          message: '"Nome" não pode ser vazio',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
            },
          ],
        },
        expected: {
          message: '"Sobrenome" é obrigatório',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
              last_name: null,
            },
          ],
        },
        expected: {
          message: '"Sobrenome" inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
              last_name: '',
            },
          ],
        },
        expected: {
          message: '"Sobrenome" não pode ser vazio',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
              last_name: faker.name.lastName(),
            },
          ],
        },
        expected: {
          message: 'O CPF do terceiro é obrigatório',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
              last_name: faker.name.lastName(),
              document: 12345678909,
            },
          ],
        },
        expected: {
          message: 'O CPF do terceiro inválido',
        },
      },
      {
        payload: {
          user_id: faker.datatype.uuid(),
          vehicle: faker.vehicle.vehicle(),
          year: 2022,
          license_plate: faker.vehicle.vrm(),
          description: faker.lorem.words(4),
          users: [
            {
              first_name: faker.name.firstName(),
              last_name: faker.name.lastName(),
              document: 'abcdrfgfhijkl',
            },
          ],
        },
        expected: {
          message: 'CPF inválido',
        },
      },
    ];
  }
}
