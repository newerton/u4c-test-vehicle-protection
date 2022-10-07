import * as Handlers from './handlers';
import * as Helpers from './helpers';
import * as Schemas from './schemas';

export const userRouters = [
  {
    method: 'GET',
    path: '/users',
    options: {
      tags: ['api', 'users'],
      description: 'Returns all users',
      notes: 'We should paginate instead of returning all users at once',
      handler: Handlers.getUsers,
    },
  },
  {
    method: 'GET',
    path: '/users/{id}',
    options: {
      tags: ['api', 'users'],
      description: 'Returns a user',
      pre: [
        {
          assign: 'userExists',
          method: Helpers.userExists,
        },
      ],
      handler: Handlers.getUser,
      validate: Schemas.uuidValidation,
    },
  },
  {
    method: 'POST',
    path: '/users',
    options: {
      tags: ['api', 'users'],
      description: 'Creates a new user',
      pre: [
        {
          assign: 'userRegistered',
          method: Helpers.userRegistered,
        },
      ],
      handler: Handlers.createUser,
      validate: Schemas.createValidationUser,
    },
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    options: {
      tags: ['api', 'users'],
      description: 'Update a new user',
      pre: [
        {
          assign: 'userExists',
          method: Helpers.userExists,
        },
      ],
      handler: Handlers.updateUser,
      validate: Schemas.updateValidationUser,
    },
  },
];
