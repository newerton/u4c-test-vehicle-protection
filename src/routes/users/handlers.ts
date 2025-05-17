import { Request } from '@hapi/hapi';
import { hash } from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { ResponseToolkit } from 'hapi';

import { AppDataSource } from '@database/typeorm/datasource';
import { USER_TYPE, User } from '@entities/user.entity';

export const getUsers = async () => {
  const repository = AppDataSource.getRepository(User);
  const users = await repository.find({
    where: { is_active: true },
    order: {
      created_at: 'DESC',
    },
  });
  return instanceToPlain(users);
};

export const getUser = async (request: Request) => {
  const { id } = request.params;
  const repository = AppDataSource.getRepository(User);
  const user = await repository.findOneBy({ id });
  return instanceToPlain(user);
};

export const createUser = async (request: Request, h: ResponseToolkit) => {
  const { document, password } = <User>request.payload;
  const repository = AppDataSource.getRepository(User);
  const hashedPassword = await hash(password, 8);

  await repository.save({
    ...(request.payload as User),
    type: USER_TYPE.CUSTOMER,
    document: document.replace(/\D/g, ''),
    password: hashedPassword,
  });

  return h.response().code(201);
};

export const updateUser = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.params;
  const payload = request.payload as any;

  delete payload.document;

  const newPayload = { id, ...payload };

  const password = newPayload.password;
  const passwordIsValid =
    password !== undefined && password !== null && password.length >= 6;
  delete newPayload.password;
  delete newPayload.repeat_password;
  if (passwordIsValid) {
    const hashedPassword = await hash(String(password), 8);
    newPayload.password = hashedPassword;
  }

  const repository = AppDataSource.getRepository(User);
  await repository.save(newPayload);

  return h.response().code(204);
};
