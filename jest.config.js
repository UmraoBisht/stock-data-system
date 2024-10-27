// jest.config.js
export default {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'node'],
    transform: {
      '^.+\\.js$': 'babel-jest', // Use babel-jest for ESM support
    },
  };
  