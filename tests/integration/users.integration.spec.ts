import * as path from 'path';

import { faker } from '@faker-js/faker/locale/pt_BR';
import { Server } from '@hapi/hapi';
import { cpf } from 'cpf-cnpj-validator';
import request from 'supertest';
import { validate as isValidUUID } from 'uuid';

import { AppDataSource } from '@database/typeorm/datasource';
import { UserFixtures } from '@routes/users/fixtures';

import { getServer } from '../../src/index';

enum USER_TYPE {
  CUSTOMER = 'CUSTOMER',
  USER = 'USER',
}

describe('User e2e Tests', () => {
  let server: Server;
  let connection: any;
  let userPayload: Record<string, any>;

  beforeAll(async () => {
    AppDataSource.setOptions({
      entities: [path.join(__dirname, '../../src/entities/*.entity.ts')],
      migrations: [path.join(__dirname, '../../src/entities/*.entity.js')],
      synchronize: true,
      dropSchema: true,
    });
    connection = await AppDataSource.initialize();
    await connection.synchronize(true);
    server = await getServer();
  });

  beforeEach(() => {
    userPayload = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      document: cpf.generate(),
      password: '123456',
      repeat_password: '123456',
    };
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe('GET /v1/users', () => {
    it('should return status code 200', async () => {
      await request(server.listener).get('/v1/users').expect(200);
    });

    it('should return status code 200 and a user object', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const users = await request(server.listener).get('/v1/users').expect(200);
      const {
        id,
        type,
        first_name,
        last_name,
        email,
        document,
        birthday,
        phone,
        is_active,
      } = users.body[0];

      expect(isValidUUID(id)).toBeTruthy();
      expect(type).toEqual(USER_TYPE.CUSTOMER);
      expect(first_name).toEqual(userPayload.first_name);
      expect(last_name).toEqual(userPayload.last_name);
      expect(email).toBeNull();
      expect(document).toEqual(userPayload.document);
      expect(birthday).toBeNull();
      expect(phone).toBeNull();
      expect(is_active).toBeTruthy();
    });
  });

  describe('GET /v1/users/{id}', () => {
    it('should return status code 200', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const users = await request(server.listener).get('/v1/users').expect(200);
      const { id } = users.body[0];
      const user = await request(server.listener)
        .get(`/v1/users/${id}`)
        .expect(200);

      expect(isValidUUID(id)).toBeTruthy();
      expect(user.body.type).toEqual(USER_TYPE.CUSTOMER);
      expect(user.body.first_name).toEqual(userPayload.first_name);
      expect(user.body.last_name).toEqual(userPayload.last_name);
      expect(user.body.email).toBeNull();
      expect(user.body.document).toEqual(userPayload.document);
      expect(user.body.birthday).toBeNull();
      expect(user.body.phone).toBeNull();
      expect(user.body.is_active).toBeTruthy();
    });

    it('should return status code 422 when ID is number', async () => {
      await request(server.listener).get('/v1/users/123').expect(422).expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: '"ID" não existe',
      });
    });

    it('should return status code 404 when ID not exist', async () => {
      await request(server.listener)
        .get('/v1/users/905b5b56-106a-4081-b497-cf3018ed7ff8')
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Usuário não encontrado.',
        });
    });
  });

  describe('POST /v1/users', () => {
    it('should return status code 200, successfully registered', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);
    });

    it('should return status code 409, user not found', async () => {
      const userPayload = {
        first_name: 'John',
        last_name: 'Doe',
        document: cpf.generate(),
        password: '123456',
        repeat_password: '123456',
      };
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Usuário já cadastrado.',
        });
    });

    describe('should respond error with 422 when field is required', () => {
      const errorResponse = {
        statusCode: 422,
        error: 'Unprocessable Entity',
      };
      const fixtures = UserFixtures.invalidRequired();
      test.each(fixtures)(
        'when payload $payload',
        async ({ payload, expected }) => {
          await request(server.listener)
            .post('/v1/users')
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
      const fixtures = UserFixtures.invalidCreateRequest();
      test.each(fixtures)(
        'when payload $payload',
        async ({ payload, expected }) => {
          await request(server.listener)
            .post('/v1/users')
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

  describe('PUT /v1/users', () => {
    it('should return status code 204 when update a user email', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const users = await request(server.listener).get('/v1/users').expect(200);
      const {
        id,
        type,
        first_name,
        last_name,
        email,
        document,
        birthday,
        phone,
        is_active,
      } = users.body[0];

      expect(isValidUUID(id)).toBeTruthy();
      expect(type).toEqual(USER_TYPE.CUSTOMER);
      expect(first_name).toEqual(userPayload.first_name);
      expect(last_name).toEqual(userPayload.last_name);
      expect(email).toBeNull();
      expect(document).toEqual(userPayload.document);
      expect(birthday).toBeNull();
      expect(phone).toBeNull();
      expect(is_active).toBeTruthy();

      await request(server.listener)
        .put(`/v1/users/${id}`)
        .send({ email: 'email@email.com' })
        .expect(204);

      const user = await request(server.listener)
        .get(`/v1/users/${id}`)
        .expect(200);

      expect(user.body.email).toEqual('email@email.com');
    });

    it('should return status code 204 when update a user password', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const users = await request(server.listener).get('/v1/users').expect(200);
      const {
        id,
        type,
        first_name,
        last_name,
        email,
        document,
        birthday,
        phone,
        is_active,
      } = users.body[0];

      expect(isValidUUID(id)).toBeTruthy();
      expect(type).toEqual(USER_TYPE.CUSTOMER);
      expect(first_name).toEqual(userPayload.first_name);
      expect(last_name).toEqual(userPayload.last_name);
      expect(email).toBeNull();
      expect(document).toEqual(userPayload.document);
      expect(birthday).toBeNull();
      expect(phone).toBeNull();
      expect(is_active).toBeTruthy();

      await request(server.listener)
        .put(`/v1/users/${id}`)
        .send({ password: '12345678' })
        .expect(204);
    });

    it('should return status code 204 when update a user password', async () => {
      await request(server.listener)
        .post('/v1/users')
        .send(userPayload)
        .expect(201);

      const users = await request(server.listener).get('/v1/users').expect(200);
      const {
        id,
        type,
        first_name,
        last_name,
        email,
        document,
        birthday,
        phone,
        is_active,
      } = users.body[0];

      expect(isValidUUID(id)).toBeTruthy();
      expect(type).toEqual(USER_TYPE.CUSTOMER);
      expect(first_name).toEqual(userPayload.first_name);
      expect(last_name).toEqual(userPayload.last_name);
      expect(email).toBeNull();
      expect(document).toEqual(userPayload.document);
      expect(birthday).toBeNull();
      expect(phone).toBeNull();
      expect(is_active).toBeTruthy();

      await request(server.listener)
        .put(`/v1/users/${id}`)
        .send({ password: '12345678' })
        .expect(204);
    });

    describe('should respond error with 422 when field is invalid', () => {
      const errorResponse = {
        statusCode: 422,
        error: 'Unprocessable Entity',
      };
      const fixtures = UserFixtures.invalidUpdateRequest();
      test.each(fixtures)(
        'when payload $payload',
        async ({ payload, expected }) => {
          await request(server.listener)
            .post('/v1/users')
            .send(userPayload)
            .expect(201);

          const users = await request(server.listener)
            .get('/v1/users')
            .expect(200);
          const { id } = users.body[0];

          await request(server.listener)
            .put(`/v1/users/${id}`)
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
