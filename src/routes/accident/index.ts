import * as Handlers from './handlers';
import * as Helpers from './helpers';
import * as Schemas from './schemas';

export const accidentEventRouters = [
  {
    method: 'GET',
    path: '/accidents',
    options: {
      tags: ['api', 'accidents'],
      description: 'Returns all accident events',
      notes: 'We should paginate instead of returning all accident events',
      handler: Handlers.getAccidentEvents,
    },
  },
  {
    method: 'GET',
    path: '/accidents/{id}',
    options: {
      tags: ['api', 'accidents'],
      description: 'Returns a accident event',
      pre: [
        {
          assign: 'userExists',
          method: Helpers.accidentEventExists,
        },
      ],
      handler: Handlers.getAccidentEvent,
      validate: Schemas.uuidValidation,
    },
  },
  {
    method: 'POST',
    path: '/accidents',
    options: {
      tags: ['api', 'accidents'],
      description: 'Create a accident event',
      pre: [
        {
          assign: 'accidentRegistered',
          method: Helpers.accidentRegistered,
        },
      ],
      handler: Handlers.createAccidentEvent,
      validate: Schemas.createValidationAccidentEvent,
    },
  },
  {
    method: 'PUT',
    path: '/accidents/{id}',
    options: {
      tags: ['api', 'accidents'],
      description: 'Update a new accident event',
      pre: [
        {
          assign: 'accidentEventExists',
          method: Helpers.accidentEventExists,
        },
      ],
      handler: Handlers.updateAccidentEvent,
      validate: Schemas.updateValidationAccidentEvent,
    },
  },
];
