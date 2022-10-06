import * as Confidence from '@hapipal/confidence';
import * as dotenv from 'dotenv';

dotenv.config();

const criteria = {
  env: process.env.NODE_ENV,
};

const config = {
  $meta: 'This file configuration',
  projectName: 'U4C - Vehicle Protection',
  port: {
    web: {
      $filter: 'env',
      test: 8000,
      production: process.env.PORT,
      $default: 8000,
    },
  },
  database: {
    type: process.env.DB_DIALECT as any,
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: process.env.DB_LOGGING === 'true',
    charset: 'utf8mb4_unicode_ci',
    entities: [`./src/**/*.entity{.ts,.js}`],
    subscribers: [`./src/**/*.subscriber{.ts,.js}`],
    migrations: [`./src/database/typeorm/migrations/*{.ts,.js}`],
  },
};

const store = new Confidence.Store(config);

export const get = (key: string) => store.get(key, criteria);
export const meta = (key: string) => store.meta(key, criteria);
