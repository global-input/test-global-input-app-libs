module.exports = {
    verbose: true,
    setupFiles:['jest-canvas-mock', "<rootDir>/setupJest.js"],
    modulePathIgnorePatterns:['<rootDir>/src/__tests__/utils',
    '<rootDir>/package',
    '<rootDir>/dist']
};