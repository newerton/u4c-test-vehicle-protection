import * as Boom from '@hapi/boom';
import { Request } from '@hapi/hapi';
import { hash } from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { QueryRunner } from 'typeorm';

import { AppDataSource } from '@database/typeorm/datasource';
import { AccidentEvent } from '@entities/accident_event.entity';
import { AccidentEventUser } from '@entities/accident_event_user.entity';
import { USER_TYPE, User } from '@entities/user.entity';

type RequestAccidentEventUser = {
  first_name: string;
  last_name: string;
  document: string;
};

type RequestAccidentEvent = AccidentEvent & {
  users: RequestAccidentEventUser[];
};

export const getAccidentEvents = async () => {
  const repository = AppDataSource.getRepository(AccidentEvent);

  try {
    const accidentEvents = await repository.find({
      relations: ['owner', 'users', 'users.user'],
      where: { is_active: true },
    });
    return instanceToPlain(accidentEvents);
  } catch (e) {
    console.log(e);
    throw Boom.badRequest('Unable to retrieve accident events', e);
  }
};

export const createAccidentEvent = async (request: Request, h) => {
  const payload = <RequestAccidentEvent>request.payload;

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const model = await queryRunner.manager.save(AccidentEvent, { ...payload });
    const users = payload.users;

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

export const updateAccidentEvent = async (request: Request, h) => {
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
  const { accident_event_id, users, verifyBeforeSave } = payload;
  if (users && users.length > 0) {
    for (const user of users) {
      const { id: user_id } = await saveUser(user, queryRunner);
      if (verifyBeforeSave) {
        const accidentEventUserVerify = await accidentEventUserExist(
          accident_event_id,
          user_id,
        );

        if (accidentEventUserVerify) {
          return false;
        }
      }

      await queryRunner.manager.save(AccidentEventUser, {
        user_id,
        accident_event_id,
      });
    }
  }
}
