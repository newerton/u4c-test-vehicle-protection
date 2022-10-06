import documentValidator from 'cpf-cnpj-validator';
import * as JoiBase from 'joi';
import dateValidator from 'joi-date-dayjs';
import phoneValidator from 'joi-phone-number';

import joiMessagesSchema from 'schemas/joi.messages.schema';

const Joi = JoiBase.extend(dateValidator)
  .extend(documentValidator)
  .extend(phoneValidator);

export const createValidationUser = {
  payload: Joi.object({
    first_name: Joi.string()
      .required()
      .label('Nome')
      .messages(joiMessagesSchema),
    last_name: Joi.string()
      .label('Sobrenome')
      .allow('', null)
      .messages(joiMessagesSchema),
    email: Joi.string().allow(null).label('E-mail').messages(joiMessagesSchema),
    password: Joi.string()
      .required()
      .label('Senha')
      .messages(joiMessagesSchema),
    repeat_password: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .label('Repita a senha')
      .messages(joiMessagesSchema),
    document: Joi.document().required().cpf(),
    birthday: Joi.date()
      .allow(null)
      .format('DD/MM/YYYY')
      .error((errors: any) => {
        errors.forEach((err: JoiBase.ErrorReport) => {
          switch (err.code) {
            case 'date.base':
              err.message = 'A data de aniversário deve ser uma data válida.';
              break;
            case 'date.format':
              err.message =
                'O formato da data de aniversário está incorreta, o formato é Dia/Mês/Ano.';
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    phone: Joi.string()
      .allow(null)
      .phoneNumber({ defaultCountry: 'BR', strict: true })
      .error((errors: any) => {
        errors.forEach((err: JoiBase.ErrorReport) => {
          switch (err.code) {
            case 'phoneNumber.invalid':
              err.message = 'Número de telefone inválido.';
              break;
            default:
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
    last_name: Joi.string()
      .label('Sobrenome')
      .allow('', null)
      .messages(joiMessagesSchema),
    email: Joi.string().allow(null).label('E-mail').messages(joiMessagesSchema),
    password: Joi.string().label('Senha').messages(joiMessagesSchema),
    repeat_password: Joi.string()
      .valid(Joi.ref('password'))
      .label('Repita a senha')
      .messages(joiMessagesSchema),
    birthday: Joi.date()
      .allow(null)
      .format('DD/MM/YYYY')
      .error((errors: any) => {
        errors.forEach((err: JoiBase.ErrorReport) => {
          switch (err.code) {
            case 'date.base':
              err.message = 'A data de aniversário deve ser uma data válida.';
              break;
            case 'date.format':
              err.message =
                'O formato da data de aniversário está incorreta, o formato é Dia/Mês/Ano.';
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    phone: Joi.string()
      .allow(null)
      .phoneNumber({ defaultCountry: 'BR', strict: true })
      .error((errors: any) => {
        errors.forEach((err: JoiBase.ErrorReport) => {
          switch (err.code) {
            case 'phoneNumber.invalid':
              err.message = 'Número de telefone inválido.';
              break;
            default:
              break;
          }
        });
        return errors;
      }),
  }),
};
