import { Server } from '@hapi/hapi';

import { accidentEventRouters } from './accident';
import { userRouters } from './users';

const register = async (server: Server) => {
  server.route([...accidentEventRouters, ...userRouters]);
};

module.exports = {
  plugin: {
    register,
    name: 'routes',
    version: '1.0.0',
  },
};
