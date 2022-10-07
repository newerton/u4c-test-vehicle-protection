import documentValidator from 'cpf-cnpj-validator';
import * as JoiBase from 'joi';

import joiMessagesSchema from '@schemas/joi.messages.schema';

const Joi = JoiBase.extend(documentValidator);

export const uuidValidation = {
  params: Joi.object({
    id: Joi.string().guid().label('ID').messages(joiMessagesSchema),
  }),
};

export const createValidationAccidentEvent = {
  payload: Joi.object({
    user_id: Joi.string()
      .guid()
      .required()
      .label('Usuário')
      .messages(joiMessagesSchema),
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
      .label('Descrição')
      .messages(joiMessagesSchema),
    users: Joi.array()
      .items(
        Joi.object({
          first_name: Joi.string()
            .required()
            .label('Nome')
            .messages(joiMessagesSchema),
          last_name: Joi.string()
            .required()
            .label('Sobrenome')
            .messages(joiMessagesSchema),
          document: Joi.document()
            .required()
            .cpf()
            .error((errors: any) => {
              errors.forEach((err: JoiBase.ErrorReport) => {
                switch (err.code) {
                  case 'any.required':
                    err.message = `O CPF do terceiro é obrigatório`;
                    break;
                  case 'string.base':
                    err.message = `O CPF do terceiro inválido`;
                    break;
                }
              });
              return errors;
            }),
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
      .label('Descrição')
      .messages(joiMessagesSchema),
    users: Joi.array()
      .items(
        Joi.object({
          first_name: Joi.string()
            .required()
            .label('Nome')
            .messages(joiMessagesSchema),
          last_name: Joi.string()
            .required()
            .label('Sobrenome')
            .messages(joiMessagesSchema),
          document: Joi.document()
            .required()
            .cpf()
            .error((errors: any) => {
              errors.forEach((err: JoiBase.ErrorReport) => {
                switch (err.code) {
                  case 'any.required':
                    err.message = `O CPF do terceiro é obrigatório`;
                    break;
                  case 'string.base':
                    err.message = `O CPF do terceiro inválido`;
                    break;
                }
              });
              return errors;
            }),
        }),
      )
      .allow(null),
  }),
};
