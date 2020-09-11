module.exports = {
  root: true,
  env: {
    // node: true,
    // browser: true,
    es2020: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: require.resolve('babel-eslint'),
    extraFileExtensions: ['.vue'],
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['prettier', 'import', 'promise', 'unicorn'],
  extends: [
    'eslint-config-airbnb-base',
    'plugin:vue/vue3-recommended',
    // 'plugin:@typescript-eslint/eslint-recommended',
    // 'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:import/warnings',
    'plugin:import/errors',
    'plugin:import/typescript',
    'prettier',
    'prettier/vue',
    'prettier/@typescript-eslint',
  ],
  settings: {
    'import/resolver': {
      // [require.resolve('eslint-import-resolver-node')]: {},
      // [require.resolve('eslint-import-resolver-webpack')]: {
      //   config: 'webpack.config.js',
      // },
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'auto',
        semi: false,
        trailingComma: 'es5',
      },
    ],
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-param-reassign': [
      'warn',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e', // for e.returnvalue
        ],
      },
    ],

    // single or double - choose either, but this is a required rule
    quotes: ['error', 'single'],

    // #region rules that allow usage of plugin:vue/vue3 for vue2 files.
    // comment out if you're on vue 3
    'vue/no-deprecated-dollar-scopedslots-api': ['off'],
    'vue/require-explicit-emits': 'off',
    'vue/no-deprecated-v-bind-sync': 'off',
    // #endregion

    // #region rules that prettier should not disable
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: true,
      },
    ],
    'vue/html-self-closing': 'warn',
    // #endregion

    // #region optional rules that can be safely disabled
    'vue/custom-event-name-casing': 'warn',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'linebreak-style': 'off',
    semi: ['error', 'never'],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-shadow': ['warn'],
    'import/prefer-default-export': 'off',

    'unicorn/prevent-abbreviations': 'off',
    // Once Vetur rolls out Rename.symbol support - I'll stop using different .ts files for vue
    'unicorn/filename-case': 'off',
    'no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true },
    ],
    // #endregion
  },

  // globals: {
  //   process: 'readonly',
  // },
}
