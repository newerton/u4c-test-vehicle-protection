import documentValidator from 'cpf-cnpj-validator';
import * as JoiBase from 'joi';

import joiMessagesSchema from 'schemas/joi.messages.schema';

const Joi = JoiBase.extend(documentValidator);

export const createValidationAccidentEvent = {
  payload: Joi.object({
    user_id: Joi.string().guid().label('Usuário').messages(joiMessagesSchema),
    vehicle: Joi.string()
      .required()
      .label('Veículo')
      .messages(joiMessagesSchema),
    year: Joi.number()
      .min(4)
      .required()
      .label('Ano do veículo')
      .messages(joiMessagesSchema),
    license_plate: Joi.string()
      .required()
      .label('Placa do veículo')
      .messages(joiMessagesSchema),
    description: Joi.string()
      .max(2048)
      .required()
      .label('descrição')
      .messages(joiMessagesSchema),
    users: Joi.array()
      .items(
        Joi.object({
          first_name: Joi.string()
            .required()
            .label('Nome')
            .messages(joiMessagesSchema),
          last_name: Joi.string()
            .label('Sobrenome')
            .allow('', null)
            .messages(joiMessagesSchema),
          document: Joi.document().required().cpf(),
        }),
      )
      .allow(null),
  }),
};

export const updateValidationAccidentEvent = {
  params: Joi.object({
    id: Joi.string().guid().label('ID').messages(joiMessagesSchema),
  }),
  payload: Joi.object({
    description: Joi.string()
      .max(2048)
      .required()
      .label('descrição')
      .messages(joiMessagesSchema),
    users: Joi.array()
      .items(
        Joi.object({
          first_name: Joi.string()
            .required()
            .label('Nome')
            .messages(joiMessagesSchema),
          last_name: Joi.string()
            .label('Sobrenome')
            .allow('', null)
            .messages(joiMessagesSchema),
          document: Joi.document().required().cpf(),
        }),
      )
      .allow(null),
  }),
};
