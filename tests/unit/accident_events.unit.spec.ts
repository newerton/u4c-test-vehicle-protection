import { faker } from '@faker-js/faker/locale/pt_BR';
import * as Boom from '@hapi/boom';
import { ResponseToolkit } from '@hapi/hapi';
import { cpf } from 'cpf-cnpj-validator';

import { AppDataSource } from '@database/typeorm/datasource';

import {
  createAccidentEvent,
  updateAccidentEvent,
} from '../../src/routes/accident/handlers';

describe('Accident Events Handlers', () => {
  let accidentEventPayload;
  let originalCreateQueryRunner;

  beforeEach(() => {
    accidentEventPayload = {
      vehicle: faker.vehicle.vehicle(),
      year: 2022,
      license_plate: faker.vehicle.vrm(),
      description: faker.lorem.words(10),
      users: [
        {
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          document: cpf.generate(),
        },
      ],
      user_id: faker.string.uuid(),
    };
    // Salva o método original
    originalCreateQueryRunner =
      AppDataSource.createQueryRunner.bind(AppDataSource);
  });

  afterEach(() => {
    // Restaura o método original
    AppDataSource.createQueryRunner = originalCreateQueryRunner;
    jest.restoreAllMocks();
  });

  function mockQueryRunnerError() {
    // Mocka o queryRunner para lançar erro ao salvar
    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      manager: { save: jest.fn().mockRejectedValue(new Error('DB error')) },
      rollbackTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      release: jest.fn(),
    };
    // @ts-expect-error: mock incompleto para teste
    AppDataSource.createQueryRunner = jest.fn(() => mockQueryRunner);
    return mockQueryRunner;
  }

  it('createAccidentEvent deve lançar Boom.badRequest ao erro interno', async () => {
    mockQueryRunnerError();
    const h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    } as unknown as ResponseToolkit;
    let error;
    try {
      await createAccidentEvent(
        accidentEventPayload as unknown as import('@hapi/hapi').Request,
        h,
      );
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(Boom.isBoom(error)).toBe(true);
    expect(error.output.payload.message).toContain('Acidente não cadastrado');
  });

  it('updateAccidentEvent deve lançar Boom.badRequest ao erro interno', async () => {
    mockQueryRunnerError();
    const h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    } as unknown as ResponseToolkit;
    const payload = {
      params: { id: faker.string.uuid() },
      payload: accidentEventPayload,
    };
    let error;
    try {
      await updateAccidentEvent(
        payload as unknown as import('@hapi/hapi').Request,
        h,
      );
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(Boom.isBoom(error)).toBe(true);
    expect(error.output.payload.message).toContain('Acidente não cadastrado');
  });
});
