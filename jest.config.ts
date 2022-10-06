export default {
  displayName: {
    name: 'nestjs',
    color: 'magentaBright',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    // '^.+\\.(t|j)s$': 'ts-jest',
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageProvider: 'v8',
  coverageDirectory: '../__coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@fc/micro\\-videos/(.*)$':
      '<rootDir>/../../node_modules/@fc/micro-videos/dist/$1',
    //'#seedwork/domain': '<rootDir>/../../../node_modules/@fc/micro-videos/dist/@seedwork/domain/index.js',
    '^#seedwork/(.*)$':
      '<rootDir>/../../node_modules/@fc/micro-videos/dist/@seedwork/$1',
    //'#category/domain': '<rootDir>/../../../node_modules/@fc/micro-videos/dist/category/domain/index.js',
    '^#category/(.*)$':
      '<rootDir>/../../node_modules/@fc/micro-videos/dist/category/$1',
    '^@categories/(.*)$': '<rootDir>/app/categories/$1',
    '^@common/(.*)$': '<rootDir>/common/$1',
  },
  setupFilesAfterEnv: ['../@core/src/@seedwork/domain/tests/jest.ts'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
