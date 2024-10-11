module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(preact|@fullcalendar)/)', // Здесь указывайте модули, которые нужно трансформировать
  ],
  coveragePathIgnorePatterns : [
    '/node_modules/',
    '/assets/',
    '/vendors/',
  ],
};
