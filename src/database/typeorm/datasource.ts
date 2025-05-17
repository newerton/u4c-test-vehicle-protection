import { DataSource, DataSourceOptions } from 'typeorm';

import { get } from '@config/index';

const configDatabase: unknown = get('/database');

export const AppDataSource = new DataSource(
  configDatabase as DataSourceOptions,
);
