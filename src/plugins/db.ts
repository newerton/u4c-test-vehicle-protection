import { AppDataSource } from '@database/typeorm/datasource';

const register = () => {
  return AppDataSource;
};

module.exports = {
  plugin: {
    register,
    name: 'db-wrapper',
    version: '1.0.0',
  },
};
