module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  modulePathIgnorePatterns: ['utils', 'setup'],

  testMatch: ['**/__tests__/**/*.(j|t)s?(x)', '**/?(*.)+(spec|test).(j|t)s?(x)'],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  setupFiles: ['./src/__tests__/setup.ts'],

  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**'],
};
