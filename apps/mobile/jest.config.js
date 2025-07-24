module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@expo|expo|expo-.*|@react-navigation|expo-router|expo-modules-core|@expo/vector-icons|react-native-.*|@react-native-.*)/)',
  ],
  moduleNameMapper: {
    // ✅ Corrigé : alias sans redondance
    '^apps/mobile/(.*)$': '<rootDir>/$1',

    // Autres alias
    '^@/backend/(.*)$': '<rootDir>/../../backend/$1',

    // Mock assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',

    // Mock styles
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
