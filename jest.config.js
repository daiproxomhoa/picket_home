module.exports = {
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(ts|js)$',
  };
  