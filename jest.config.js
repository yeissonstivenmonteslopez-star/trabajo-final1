/** @type {import('jest').Config} */
export default {
  verbose: true,
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  globalTeardown: "./tests/globalTeardown.js",
  transform: {},
};
