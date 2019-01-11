module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  modulePathIgnorePatterns: ['utils'],

  testMatch: ['**/__tests__/**/*.(j|t)s?(x)', '**/?(*.)+(spec|test).(j|t)s?(x)'],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**'],
};
