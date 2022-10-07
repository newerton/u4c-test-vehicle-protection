import path from 'path';

import { faker } from '@faker-js/faker/locale/pt_BR';
import * as Boom from '@hapi/boom';
import { cpf } from 'cpf-cnpj-validator';

import { AppDataSource } from '@database/typeorm/datasource';

describe('Accident Events e2e Tests', () => {
  let accidentEventPayload;
  let connection;

  beforeAll(async () => {
    AppDataSource.setOptions({
      entities: [path.join(__dirname, '../../src/entities/*.entity.ts')],
      migrations: [path.join(__dirname, '../../src/entities/*.entity.js')],
      synchronize: true,
      dropSchema: true,
    });
    connection = await AppDataSource.initialize();
    await connection.synchronize(true);
  });

  beforeEach(() => {
    accidentEventPayload = {
      vehicle: faker.vehicle.vehicle(),
      year: 2022,
      license_plate: faker.vehicle.vrm(),
      description: faker.lorem.words(10),
      users: [
        {
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          document: cpf.generate(),
        },
      ],
    };
  });

  afterAll(async () => {
    await connection.destroy();
  });

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  describe('POST /v1/accidents', () => {
    it('should return status code 400, event not registered', async () => {
      const { createAccidentEvent } = await import(
        '../../src/routes/accident/handlers'
      );
      const handlers = { createAccidentEvent };

      jest.spyOn(handlers, 'createAccidentEvent');

      const payload = {
        user_id: faker.datatype.uuid(),
        ...accidentEventPayload,
      };

      await expect(createAccidentEvent(payload, {})).rejects.toThrow(
        Boom.badRequest('Acidente não cadastrado'),
      );
      await expect(createAccidentEvent(payload, {})).rejects.toThrowError();
    });
  });

  describe('PUT /v1/accidents', () => {
    it('should return status code 400, event not registered', async () => {
      const { updateAccidentEvent } = await import(
        '../../src/routes/accident/handlers'
      );
      const handlers = { updateAccidentEvent };

      jest.spyOn(handlers, 'updateAccidentEvent');

      const payload = {
        params: {
          id: faker.datatype.uuid(),
        },
        payload: {
          user_id: faker.datatype.uuid(),
          ...accidentEventPayload,
        },
      } as any;

      await expect(updateAccidentEvent(payload, {})).rejects.toThrow(
        Boom.badRequest('Acidente não cadastrado'),
      );
      await expect(updateAccidentEvent(payload, {})).rejects.toThrowError();
    });
  });
});
