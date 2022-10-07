import { DataSource } from 'typeorm';

import { get } from '@config/index';

const configDatabase = get('/database');

export const AppDataSource = new DataSource(configDatabase);
