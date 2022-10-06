import * as Boom from '@hapi/boom';

import { AppDataSource } from '@database/typeorm/datasource';
import { User } from '@entities/user.entity';

export const userRegistered = async (request: any, h) => {
  const { document } = request.payload;
  const repository = AppDataSource.getRepository(User);
  const user = await repository.findOneBy({
    document: document.replace(/\D/g, ''),
  });
  if (user) {
    throw Boom.conflict('Usuário já cadastrado.');
  }

  return h.continue;
};

export const userExists = async (request: any, h) => {
  const { id } = request.params;
  const repository = AppDataSource.getRepository(User);
  const user = await repository.findOneBy({ id });
  if (!user) {
    throw Boom.notFound('Usuário não encontrado.');
  }

  return h.continue;
};
