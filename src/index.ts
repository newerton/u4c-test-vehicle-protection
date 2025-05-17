import 'reflect-metadata';
import * as Boom from '@hapi/boom';
import * as Glue from '@hapi/glue';
import { Server } from '@hapi/hapi';
import * as dotenv from 'dotenv';

import { AppDataSource } from '@database/typeorm/datasource';

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

export const manifest = {
  server: {
    port: Config.get('/port/web'),
    routes: {
      validate: {
        failAction: (request, h, err) => {
          if (!err) {
            throw Boom.badRequest('Invalid request payload input');
          }
          const firstError = (err as any).details[0];
          if (firstError.context.errorCode !== undefined) {
            throw Boom.badRequest(String(err.message), {
              errorCode: firstError.context.errorCode,
            });
          } else {
            if (
              (err as any).isJoi &&
              Array.isArray((err as any).details) &&
              (err as any).details.length > 0
            ) {
              throw Boom.badData(String(err.message));
            }
            throw Boom.badRequest(String(err.message));
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
} as Glue.Manifest;

export const getServer: () => Promise<Server> = async (): Promise<Server> => {
  const server = await Glue.compose(manifest, {
    relativeTo: __dirname,
  });

  return server;
};

const startServer = async () => {
  try {
    const server: Server = await getServer();

    AppDataSource.initialize()
      .then(async () => {
        console.log('Data Source has been initialized!');
        await server.start();
        console.log('Server running at:', server.info.uri);
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });
  } catch (err) {
    console.log(err);
    console.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer()
    .then(() => {
      console.log('Server started');
    })
    .catch((err) => {
      console.error('Error starting server:', err);
      process.exit(1);
    });
} else {
  console.log('Server setup for testing.');
}
