import * as path from 'path';

import { faker } from '@faker-js/faker/locale/pt_BR';
import { Server } from '@hapi/hapi';
import { RequestAccidentEvent } from '@hapipal/confidence';
import { cpf } from 'cpf-cnpj-validator';
import request from 'supertest';
import { validate as isValidUUID } from 'uuid';

import { AppDataSource } from '@database/typeorm/datasource';
import { AccidentEventFixtures } from '@routes/accident/fixtures';

import { getServer } from '../../src/index';

enum USER_TYPE {
  CUSTOMER = 'CUSTOMER',
  USER = 'USER',
}

describe('Accident Events e2e Tests', () => {
  let server: Server;
  let connection: any;
  let userPayload: Record<string, any>;
  let accidentEventPayload: RequestAccidentEvent;

  beforeAll(async () => {
    try {
      AppDataSource.setOptions({
        entities: [path.join(__dirname, '../../src/entities/*.entity.ts')],
        migrations: [path.join(__dirname, '../../src/entities/*.entity.js')],
        synchronize: true,
        dropSchema: true,
      });
      connection = await AppDataSource.initialize();
      await connection.synchronize(true);
      server = await getServer();
    } catch (err) {
      console.error('beforeAll error:', err);
      throw err;
    }
  });

  beforeEach(() => {
    userPayload = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      document: cpf.generate(),
      password: '123456',
      repeat_password: '123456',
    };
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
      user_id: '', // será preenchido dinamicamente nos testes
    };
  });

  afterAll(async () => {
    if (connection) {
      await connection.destroy();
    }
  });

  describe('GET /v1/accidents', () => {
    it('should return status code 200', async () => {
      await request(server.listener).get('/v1/accidents').expect(200);
    });

    it('should return status code 200 and a accident event object without users', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const allUsers = await request(server.listener)
        .get('/v1/users')
        .expect(200);
      const user = allUsers.body[0];

      delete accidentEventPayload.users;
      const payload = {
        ...accidentEventPayload,
        user_id: user.id,
      };
      await request(server.listener)
        .post('/v1/accidents')
        .send(payload)
        .expect(201);

      const accidentEvents = await request(server.listener)
        .get('/v1/accidents')
        .expect(200);
      const {
        id,
        vehicle,
        year,
        license_plate,
        description,
        is_active,
        owner,
        users,
      } = accidentEvents.body[0];

      expect(isValidUUID(id)).toBeTruthy();
      expect(vehicle).toEqual(payload.vehicle);
      expect(year).toEqual(payload.year);
      expect(year.toString()).toHaveLength(4);
      expect(year).toEqual(expect.any(Number));
      expect(license_plate).toEqual(payload.license_plate);
      expect(description).toEqual(payload.description);
      expect(is_active).toBeTruthy();
      expect(owner).toStrictEqual(user);
      expect(users).toEqual([]);
    });

    it('should return status code 200 and a accident event object with users', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const allUsers = await request(server.listener)
        .get('/v1/users')
        .expect(200);
      const user = allUsers.body[0];

      const payload = {
        ...accidentEventPayload,
        user_id: user.id,
      };

      await request(server.listener)
        .post('/v1/accidents')
        .send(payload)
        .expect(201);

      const accidentEvents = await request(server.listener)
        .get('/v1/accidents')
        .expect(200);

      const {
        id,
        vehicle,
        year,
        license_plate,
        description,
        is_active,
        owner,
        users,
      } = accidentEvents.body[0];

      expect(isValidUUID(id)).toBeTruthy();
      expect(vehicle).toEqual(payload.vehicle);
      expect(year).toEqual(payload.year);
      expect(year.toString()).toHaveLength(4);
      expect(year).toEqual(expect.any(Number));
      expect(license_plate).toEqual(payload.license_plate);
      expect(description).toEqual(payload.description);
      expect(is_active).toBeTruthy();
      expect(owner).toEqual(user);
      expect(users[0].user.first_name).toEqual(payload.users![0].first_name);
      expect(users[0].user.last_name).toEqual(payload.users![0].last_name);
      expect(users[0].user.document).toEqual(payload.users![0].document);
      expect(users[0].user.type).toEqual(USER_TYPE.USER);
    });
  });

  describe('GET /v1/accidents/{id}', () => {
    it('should return status code 200', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const allUsers = await request(server.listener)
        .get('/v1/users')
        .expect(200);
      const user = allUsers.body[0];

      const payload = {
        ...accidentEventPayload,
        user_id: user.id,
      };

      await request(server.listener)
        .post('/v1/accidents')
        .send(payload)
        .expect(201);

      const accidentEvents = await request(server.listener)
        .get('/v1/accidents')
        .expect(200);

      const { id } = accidentEvents.body[0];
      const accidentEvent = await request(server.listener)
        .get(`/v1/accidents/${id}`)
        .expect(200);

      expect(isValidUUID(id)).toBeTruthy();
      expect(accidentEvent.body.vehicle).toEqual(payload.vehicle);
      expect(accidentEvent.body.year).toEqual(payload.year);
      expect(accidentEvent.body.year.toString()).toHaveLength(4);
      expect(accidentEvent.body.year).toEqual(expect.any(Number));
      expect(accidentEvent.body.license_plate).toEqual(payload.license_plate);
      expect(accidentEvent.body.description).toEqual(payload.description);
      expect(accidentEvent.body.is_active).toBeTruthy();
      expect(accidentEvent.body.owner).toEqual(user);
      expect(accidentEvent.body.users[0].user.first_name).toEqual(
        payload.users![0].first_name,
      );
      expect(accidentEvent.body.users[0].user.last_name).toEqual(
        payload.users![0].last_name,
      );
      expect(accidentEvent.body.users[0].user.document).toEqual(
        payload.users![0].document,
      );
      expect(accidentEvent.body.users[0].user.type).toEqual(USER_TYPE.USER);
    });

    it('should return status code 422 when ID is number', async () => {
      await request(server.listener)
        .get('/v1/accidents/123')
        .expect(422)
        .expect({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: '"ID" não existe',
        });
    });

    it('should return status code 404 when ID not exist', async () => {
      await request(server.listener)
        .get('/v1/accidents/905b5b56-106a-4081-b497-cf3018ed7ff8')
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Evento não encontrado.',
        });
    });
  });

  describe('POST /v1/accidents', () => {
    it('should return status code 200, successfully registered', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const allUsers = await request(server.listener)
        .get('/v1/users')
        .expect(200);
      const user = allUsers.body[0];

      const payload = {
        ...accidentEventPayload,
        user_id: user.id,
      };
      await request(server.listener)
        .post('/v1/accidents')
        .send(payload)
        .expect(201);
    });

    describe('should respond error with 422 when field is required', () => {
      const errorResponse = {
        statusCode: 422,
        error: 'Unprocessable Entity',
      };
      const fixtures = AccidentEventFixtures.invalidRequired();
      test.each(fixtures)(
        'when payload $payload',
        async ({ payload, expected }) => {
          await request(server.listener)
            .post('/v1/accidents')
            .send(payload)
            .expect(422)
            .expect({
              ...errorResponse,
              ...expected,
            });
        },
      );
    });

    describe('should respond error with 422 when field is invalid', () => {
      const errorResponse = {
        statusCode: 422,
        error: 'Unprocessable Entity',
      };
      const fixtures = AccidentEventFixtures.invalidCreateRequest();
      test.each(fixtures)(
        'when payload $payload',
        async ({ payload, expected }) => {
          await request(server.listener)
            .post('/v1/accidents')
            .send(payload)
            .expect(422)
            .expect({
              ...errorResponse,
              ...expected,
            });
        },
      );
    });

    it('should return status code 404, user not found', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const payload = {
        ...accidentEventPayload,
        user_id: faker.string.uuid(),
      };
      await request(server.listener)
        .post('/v1/accidents')
        .send(payload)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Usuário não encontrado.',
        });
    });

    it('should return status code 201, successfully registered and change USER to CUSTOMER', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const allUsers = await request(server.listener)
        .get('/v1/users')
        .expect(200);
      const user = allUsers.body[0];

      const payload_1 = {
        ...accidentEventPayload,
        user_id: user.id,
      };
      await request(server.listener)
        .post('/v1/accidents')
        .send(payload_1)
        .expect(201);

      const accidentEvents_1 = await request(server.listener)
        .get('/v1/accidents')
        .expect(200);

      const { users } = accidentEvents_1.body[0];
      expect(users[0].user.type).toEqual(USER_TYPE.USER);

      const payload_2 = {
        ...accidentEventPayload,
        user_id: users[0].user.id,
        users: [
          {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            document: cpf.generate(),
          },
        ],
      };
      await request(server.listener)
        .post('/v1/accidents')
        .send(payload_2)
        .expect(201);

      const accidentEvents_2 = await request(server.listener)
        .get('/v1/accidents')
        .expect(200);
      const { owner, users: users_2 } = accidentEvents_2.body[0];

      expect(owner.id).toEqual(users[0].user.id);
      expect(owner.type).toEqual(USER_TYPE.CUSTOMER);
      expect(users_2[0].user.type).toEqual(USER_TYPE.USER);
    });
  });

  describe('PUT /v1/accidents', () => {
    it('should return status code 204 when update a accident event description', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const allUsers = await request(server.listener)
        .get('/v1/users')
        .expect(200);
      const user = allUsers.body[0];

      const payload = {
        ...accidentEventPayload,
        user_id: user.id,
      };

      await request(server.listener)
        .post('/v1/accidents')
        .send(payload)
        .expect(201);

      const accidentEvents = await request(server.listener)
        .get('/v1/accidents')
        .expect(200);

      const {
        id,
        vehicle,
        year,
        license_plate,
        description,
        is_active,
        owner,
        users,
      } = accidentEvents.body[0];

      expect(isValidUUID(id)).toBeTruthy();
      expect(vehicle).toEqual(payload.vehicle);
      expect(year).toEqual(payload.year);
      expect(year.toString()).toHaveLength(4);
      expect(year).toEqual(expect.any(Number));
      expect(license_plate).toEqual(payload.license_plate);
      expect(description).toEqual(payload.description);
      expect(is_active).toBeTruthy();
      expect(owner).toEqual(user);
      expect(users[0].user.first_name).toEqual(payload.users![0].first_name);
      expect(users[0].user.last_name).toEqual(payload.users![0].last_name);
      expect(users[0].user.document).toEqual(payload.users![0].document);
      expect(users[0].user.type).toEqual(USER_TYPE.USER);

      await request(server.listener)
        .put(`/v1/accidents/${id}`)
        .send({ description: accidentEventPayload.description })
        .expect(204);

      const response = await request(server.listener)
        .get(`/v1/accidents/${id}`)
        .expect(200);

      expect(response.body.description).toEqual(
        accidentEventPayload.description,
      );
    });

    it('should return status code 204 when update a accident event users', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const allUsers = await request(server.listener)
        .get('/v1/users')
        .expect(200);
      const user = allUsers.body[0];

      const payload = {
        ...accidentEventPayload,
        user_id: user.id,
      };

      await request(server.listener)
        .post('/v1/accidents')
        .send(payload)
        .expect(201);

      const accidentEvents = await request(server.listener)
        .get('/v1/accidents')
        .expect(200);

      const {
        id,
        vehicle,
        year,
        license_plate,
        description,
        is_active,
        owner,
        users,
      } = accidentEvents.body[0];

      expect(isValidUUID(id)).toBeTruthy();
      expect(vehicle).toEqual(payload.vehicle);
      expect(year).toEqual(payload.year);
      expect(year.toString()).toHaveLength(4);
      expect(year).toEqual(expect.any(Number));
      expect(license_plate).toEqual(payload.license_plate);
      expect(description).toEqual(payload.description);
      expect(is_active).toBeTruthy();
      expect(owner).toEqual(user);
      expect(users[0].user.first_name).toEqual(payload.users![0].first_name);
      expect(users[0].user.last_name).toEqual(payload.users![0].last_name);
      expect(users[0].user.document).toEqual(payload.users![0].document);
      expect(users[0].user.type).toEqual(USER_TYPE.USER);

      await request(server.listener)
        .put(`/v1/accidents/${id}`)
        .send({
          description: accidentEventPayload.description,
          users: accidentEventPayload.users,
        })
        .expect(204);

      const response = await request(server.listener)
        .get(`/v1/accidents/${id}`)
        .expect(200);

      expect(response.body.users[0].user.first_name).toEqual(
        accidentEventPayload.users![0].first_name,
      );
      expect(response.body.users[0].user.last_name).toEqual(
        accidentEventPayload.users![0].last_name,
      );
      expect(response.body.users[0].user.document).toEqual(
        accidentEventPayload.users![0].document,
      );
      expect(response.body.users[0].user.type).toEqual(USER_TYPE.USER);
    });

    describe('should respond error with 422 when field is invalid', () => {
      const errorResponse = {
        statusCode: 422,
        error: 'Unprocessable Entity',
      };
      const fixtures = AccidentEventFixtures.invalidUpdateRequest();

      test.each(fixtures)(
        'when payload $payload',
        async ({ payload, expected }) => {
          await request(server.listener)
            .post('/v1/users')
            .send(userPayload)
            .expect(201);

          const allUsers = await request(server.listener)
            .get('/v1/users')
            .expect(200);
          const user = allUsers.body[0];

          const accidentPayload = {
            ...accidentEventPayload,
            user_id: user.id,
          };

          await request(server.listener)
            .post('/v1/accidents')
            .send(accidentPayload)
            .expect(201);

          const accidentEvents = await request(server.listener)
            .get('/v1/accidents')
            .expect(200);

          const { id } = accidentEvents.body[0];

          await request(server.listener)
            .put(`/v1/accidents/${id}`)
            .send(payload)
            .expect(422)
            .expect({
              ...errorResponse,
              ...expected,
            });
        },
      );
    });
  });
});
