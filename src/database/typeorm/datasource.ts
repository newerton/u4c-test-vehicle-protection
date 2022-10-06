import { DataSource } from 'typeorm';

import { get } from '@config/index';

const configDatabase = get('/database');

export const AppDataSource = new DataSource(configDatabase);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
