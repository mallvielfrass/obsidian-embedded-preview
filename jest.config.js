module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  moduleNameMapper: {
    "^obsidian$": "node_modules/obsidian",
  },

  modulePathIgnorePatterns: ["node_modules/obsidian"],
};
