export default {
  displayName: {
    name: 'u2c',
    color: 'magentaBright',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['src/routes/**/*.(t|j)s'],
  coverageProvider: 'v8',
  coverageDirectory: './tests/__coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@plugins/(.*)$': '<rootDir>/src/plugins/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@schemas/(.*)$': '<rootDir>/src/schemas/$1',
  },
  setupFilesAfterEnv: ['./tests/_jest.ts'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
