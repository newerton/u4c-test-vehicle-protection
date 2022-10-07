import * as Boom from '@hapi/boom';
import { Request } from '@hapi/hapi';

import { AppDataSource } from '@database/typeorm/datasource';
import { AccidentEvent } from '@entities/accident_event.entity';
import { User } from '@entities/user.entity';

export const accidentRegistered = async (request: Request, h) => {
  const { user_id } = <AccidentEvent>request.payload;

  const repository = AppDataSource.getRepository(User);
  const user = await repository.findOneBy({
    id: user_id,
  });
  if (!user) {
    throw Boom.notFound('Usuário não encontrado.');
  }

  // TODO
  // Verificar no dominio do projeto, se precisa validar a placa do veículo

  return h.continue;
};

export const accidentEventExists = async (request: Request, h) => {
  const { id } = request.params;
  const repository = AppDataSource.getRepository(AccidentEvent);
  const accidentEvent = await repository.findOneBy({ id });
  if (!accidentEvent) {
    throw Boom.notFound('Evento não encontrado.');
  }

  return h.continue;
};
