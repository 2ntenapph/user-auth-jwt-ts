module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'], // Define source and test folders
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/*.test.ts'], // Match test files
    globals: {
      'ts-jest': {
        tsconfig: './tsconfig.json',
      },
    },
  };
  