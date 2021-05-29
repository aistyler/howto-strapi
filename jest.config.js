//const {defaults} = require('jest-config');
/**
 * JEST Configuration
 * 
 * See https://jestjs.io/docs/en/configuration
 */
module.exports = {
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)", 
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.tmp/","/tmp/",
    "/.cache/",
    "/build/",
    "/strapi/",
    "/tests/e2e/",
  ],
  // A path to a module which exports an async function that is triggered once before all test suites
  globalSetup: './tests/global-setup.js',
  // A path to a module which exports an async function that is triggered once after all test suites
  globalTeardown: './tests/global-teardown.js',
  // favor of setupFilesAfterEnv in jest 24
  // The test environment that will be used for testing
  testEnvironment: './tests/strapi-test-env.js',

  setupFilesAfterEnv: ['./tests/setup-after-env.js'],
  globals: {
  },
}
