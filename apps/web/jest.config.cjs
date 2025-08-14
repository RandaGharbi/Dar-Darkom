const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig({
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // Alias pour les imports
    '^@/(.*)$': '<rootDir>/$1',
    '^@/web/(.*)$': '<rootDir>/$1',
    // Gestion des assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.cjs',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Plus besoin de transform, next/jest gère SWC
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // Supprimer les avertissements console.error spécifiques
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  // Configuration pour supprimer les avertissements React act()
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
}); 