module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest'],
    '^.+\\.(js|jsx)$': ['babel-jest']
  },
  transformIgnorePatterns: ['node_modules/(?!(fp-ts)/)'],
  testRegex: 'test',
  moduleFileExtensions: ['ts', 'js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
