import { Server, ServerRoute } from '@hapi/hapi';

import { accidentEventRouters } from './accident';
import { userRouters } from './users';

const register = (server: Server) => {
  server.route([...accidentEventRouters, ...userRouters] as ServerRoute[]);
};

module.exports = {
  plugin: {
    register,
    name: 'routes',
    version: '1.0.0',
  },
};
