import * as Boom from '@hapi/boom';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { hash } from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { QueryRunner } from 'typeorm';

import { AppDataSource } from '@database/typeorm/datasource';

// Tipos
import type { User } from '@entities/user.entity';

type RequestAccidentEventUser = {
  first_name: string;
  last_name: string;
  document: string;
};

type RequestAccidentEvent = {
  user_id: string;
  vehicle: string;
  year: number;
  license_plate: string;
  description: string;
  users: RequestAccidentEventUser[];
};

export const getAccidentEvents = async () => {
  const { AccidentEvent } = await import('@entities/accident_event.entity');
  const repository = AppDataSource.getRepository(AccidentEvent);
  const accidentEvents = await repository.find({
    relations: ['owner', 'users', 'users.user'],
    where: { is_active: true },
    order: {
      created_at: 'DESC',
    },
  });
  return instanceToPlain(accidentEvents);
};

export const getAccidentEvent = async (request: Request) => {
  const { AccidentEvent } = await import('@entities/accident_event.entity');
  const repository = AppDataSource.getRepository(AccidentEvent);
  const accidentEvents = await repository.findOne({
    relations: ['owner', 'users', 'users.user'],
    where: { id: request.params.id, is_active: true },
  });
  return instanceToPlain(accidentEvents);
};

export const createAccidentEvent = async (
  request: Request,
  h: ResponseToolkit,
) => {
  const { AccidentEvent } = await import('@entities/accident_event.entity');
  const { USER_TYPE, User } = await import('@entities/user.entity');
  const payload = <RequestAccidentEvent>request.payload;
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const { users, ...eventData } = payload;
    const model = await queryRunner.manager.save(AccidentEvent, eventData);
    await changeUserType(payload.user_id, queryRunner);
    await saveAccidentEventUsers(
      {
        accident_event_id: model.id,
        users,
        verifyBeforeSave: false,
      },
      queryRunner,
    );
    await queryRunner.commitTransaction();
  } catch (error: any) {
    console.log(error);
    await queryRunner.rollbackTransaction();
    throw Boom.badRequest('Acidente não cadastrado');
  } finally {
    await queryRunner.release();
  }
  return h.response().code(201);
};

export const updateAccidentEvent = async (
  request: Request,
  h: ResponseToolkit,
) => {
  const { AccidentEvent } = await import('@entities/accident_event.entity');
  const { USER_TYPE, User } = await import('@entities/user.entity');
  const { id } = request.params;
  const { description, users } = <RequestAccidentEvent>request.payload;
  const newPayload = { id, description };
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(AccidentEvent, newPayload);
    await saveAccidentEventUsers(
      {
        accident_event_id: id,
        users,
        verifyBeforeSave: true,
      },
      queryRunner,
    );
    await queryRunner.commitTransaction();
  } catch (error: any) {
    console.log(error);
    await queryRunner.rollbackTransaction();
    throw Boom.badRequest('Acidente não cadastrado');
  } finally {
    await queryRunner.release();
  }
  return h.response().code(204);
};

async function accidentEventUserExist(
  accident_event_id: string,
  user_id: string,
) {
  const { AccidentEventUser } = await import(
    '@entities/accident_event_user.entity'
  );
  const accidentEventUserRepository =
    AppDataSource.getRepository(AccidentEventUser);
  return await accidentEventUserRepository.findOneBy({
    accident_event_id,
    user_id,
  });
}

async function saveUser(
  user: RequestAccidentEventUser,
  queryRunner: QueryRunner,
): Promise<User> {
  const { USER_TYPE, User } = await import('@entities/user.entity');
  const userRepository = AppDataSource.getRepository(User);
  const document = user.document.replace(/\D/g, '');
  let userExist = await userRepository.findOneBy({ document });
  if (!userExist) {
    const hashedPassword = await hash(Math.random().toString(), 8);
    userExist = await queryRunner.manager.save(User, {
      ...user,
      type: USER_TYPE.USER,
      document,
      password: hashedPassword,
    });
  }
  return userExist;
}

async function changeUserType(
  user_id: string,
  queryRunner: QueryRunner,
): Promise<void> {
  const { USER_TYPE, User } = await import('@entities/user.entity');
  const repository = AppDataSource.getRepository(User);
  const model = await repository.findOneBy({ id: user_id });
  if (model && model.type === USER_TYPE.USER) {
    await queryRunner.manager.save(User, {
      ...model,
      type: USER_TYPE.CUSTOMER,
    });
  }
}

async function saveAccidentEventUsers(
  payload: {
    accident_event_id: string;
    users: RequestAccidentEventUser[];
    verifyBeforeSave: boolean;
  },
  queryRunner: QueryRunner,
) {
  const { AccidentEventUser } = await import(
    '@entities/accident_event_user.entity'
  );
  if (payload.users && payload.users.length > 0) {
    for (const user of payload.users) {
      const { id: user_id } = await saveUser(user, queryRunner);
      if (payload.verifyBeforeSave) {
        const accidentEventUserVerify = await accidentEventUserExist(
          payload.accident_event_id,
          user_id,
        );
        if (accidentEventUserVerify) {
          return false;
        }
      }
      await queryRunner.manager.save(AccidentEventUser, {
        user_id,
        accident_event_id: payload.accident_event_id,
      });
    }
  }
}
