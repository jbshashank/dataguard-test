'use strict';

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coverageDirectory: './coverage/',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  verbose: true,
  testResultsProcessor: 'jest-sonar-reporter',
};
