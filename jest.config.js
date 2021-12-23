/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    '<rootDir>',
    './App/'
  ],
  moduleDirectories: [
    'node_modules'
  ],
  moduleNameMapper: {
    '@Requests': '<rootDir>/App/Core/Routing',
    '@Decorators': '<rootDir>/App/Core/Decorators',
    '@Services/(.*)': '<rootDir>/App/Services/$1',
    '@Models': '<rootDir>/App/Models',
    '@Interfaces': '<rootDir>/App/Interfaces'
  }
};