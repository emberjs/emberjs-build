module.exports = {
  root: true,
  env: {
    'node': true,
  },
  rules: {
    // "proto": true,
    'no-proto': 2,

    // "strict": true,
    'strict': [2, 'global'],

    // "indent": 2,
    'indent': [2, 2, {'SwitchCase': 1}],

    // "camelcase": true,
    'camelcase': [2, {properties: "never"}],

    // "boss": true,
    'no-cond-assign': [2, 'except-parens'],

    // "curly": true,
    'curly': 2,

    // "latedef": "nofunc",
    'no-use-before-define': [2, {'functions': false}],

    // "debug": true,
    'no-debugger': 2,

    // "eqeqeq": true,
    'eqeqeq': 2,

    // "evil": true,
    'no-eval': 2,

    // "laxbreak": true,
    'linebreak-style': [2, 'unix'],

    // "newcap": true,
    'new-cap': 2,

    // "noarg": true,
    'no-caller': 2,

    // "noempty": false,
    'no-empty': 2,

    // "quotmark": true,
    'quotes': [2, 'single'],

    // "undef": true,
    'no-undef': 2,

    // "unused": true,
    'no-unused-vars': 2,

    // "trailing": true,
    'no-trailing-spaces': 2,

    // "eqnull": true
    'no-eq-null': 2,
  },
};
