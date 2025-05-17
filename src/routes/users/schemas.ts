import documentValidator from 'cpf-cnpj-validator';
import * as JoiBase from 'joi';
import dateValidator from 'joi-date-dayjs';
import phoneValidator from 'joi-phone-number';

import joiMessagesSchema from '@schemas/joi.messages.schema';

const Joi = JoiBase.extend(dateValidator as unknown as JoiBase.Extension)
  .extend(documentValidator as unknown as JoiBase.Extension)
  .extend(phoneValidator as unknown as JoiBase.Extension);

export const uuidValidation = {
  params: Joi.object({
    id: Joi.string().guid().label('ID').messages(joiMessagesSchema),
  }),
};

export const createValidationUser = {
  payload: Joi.object({
    first_name: Joi.string()
      .required()
      .label('Nome')
      .messages(joiMessagesSchema),
    last_name: Joi.string()
      .required()
      .label('Sobrenome')
      .messages(joiMessagesSchema),
    email: Joi.string()
      .email()
      .allow(null)
      .label('E-mail')
      .messages(joiMessagesSchema),
    document: Joi.document()
      .required()
      .cpf()
      .label('CPF')
      .messages(joiMessagesSchema),
    password: Joi.string()
      .min(6)
      .required()
      .label('Senha')
      .messages(joiMessagesSchema),
    repeat_password: Joi.string()
      .min(6)
      .required()
      .valid(Joi.ref('password'))
      .label('Repita a senha')
      .messages(joiMessagesSchema),
    birthday: Joi.date()
      .allow(null)
      .format('DD/MM/YYYY')
      .error((errors: Record<string, any>) => {
        errors.forEach((err: JoiBase.ErrorReport) => {
          switch (err.code) {
            case 'date.format':
              err.message =
                'O formato da data de aniversário está incorreta, o formato é Dia/Mês/Ano.';
              break;
          }
        });
        return errors;
      }),
    phone: Joi.string()
      .allow(null)
      .phoneNumber({ defaultCountry: 'BR', strict: true })
      .error((errors: Record<string, any>) => {
        errors.forEach((err: JoiBase.ErrorReport) => {
          switch (err.code) {
            case 'phoneNumber.invalid':
              err.message = 'Número de telefone inválido.';
              break;
          }
        });
        return errors;
      }),
  }),
};

export const updateValidationUser = {
  params: Joi.object({
    id: Joi.string().guid().label('ID').messages(joiMessagesSchema),
  }),
  payload: Joi.object({
    first_name: Joi.string().label('Nome').messages(joiMessagesSchema),
    last_name: Joi.string().label('Sobrenome').messages(joiMessagesSchema),
    email: Joi.string()
      .email()
      .allow(null)
      .label('E-mail')
      .messages(joiMessagesSchema),
    password: Joi.string().min(6).label('Senha').messages(joiMessagesSchema),
    repeat_password: Joi.string()
      .min(6)
      .valid(Joi.ref('password'))
      .label('Repita a senha')
      .messages(joiMessagesSchema),
    birthday: Joi.date()
      .allow(null)
      .format('DD/MM/YYYY')
      .error((errors: Record<string, any>) => {
        errors.forEach((err: JoiBase.ErrorReport) => {
          switch (err.code) {
            case 'date.format':
              err.message =
                'O formato da data de aniversário está incorreta, o formato é Dia/Mês/Ano.';
              break;
          }
        });
        return errors;
      }),
    phone: Joi.string()
      .allow(null)
      .phoneNumber({ defaultCountry: 'BR', strict: true })
      .error((errors: Record<string, any>) => {
        errors.forEach((err: JoiBase.ErrorReport) => {
          switch (err.code) {
            case 'phoneNumber.invalid':
              err.message = 'Número de telefone inválido.';
              break;
          }
        });
        return errors;
      }),
  }),
};
