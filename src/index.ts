import * as Boom from '@hapi/boom';
import * as Glue from '@hapi/glue';
import * as dotenv from 'dotenv';

import * as Config from './config';

dotenv.config();

// Catch unhandling unexpected exceptions
process.on('uncaughtException', (error: Error) => {
  console.error(`uncaughtException ${error.message}`);
});

// Catch unhandling rejected promises
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const manifest = {
  server: {
    port: Config.get('/port/web'),
    routes: {
      validate: {
        failAction: (request, h, err) => {
          const firstError = err.details[0];
          if (firstError.context.errorCode !== undefined) {
            throw Boom.badRequest(err.message, {
              errorCode: firstError.context.errorCode,
            });
          } else {
            if (
              err.isJoi &&
              Array.isArray(err.details) &&
              err.details.length > 0
            ) {
              throw Boom.badData(err.message);
            }
            throw Boom.badRequest(err.message);
          }
        },
      },
    },
  },
  register: {
    plugins: [
      {
        plugin: 'blipp',
      },
      { plugin: './plugins/db' },
      {
        plugin: './routes',
        routes: { prefix: '/v1' },
      },
    ],
  },
};

const startServer = async function () {
  try {
    const server = await Glue.compose(manifest, {
      relativeTo: __dirname,
    });
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.log(err);
    console.error(err);
    process.exit(1);
  }
};

startServer();
