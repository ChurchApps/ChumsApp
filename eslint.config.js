import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
        'build',
        'node_modules',
        '.github',
        '.vscode'
    ],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-case-declarations': 'off',
      'no-constant-binary-expression': 'off',
      
      // Compact if statements and blocks
      'curly': ['error', 'multi-line'],
      'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      'nonblock-statement-body-position': ['error', 'beside'],
      
      // Object and array formatting
      'object-curly-spacing': ['error', 'always'],
      'object-curly-newline': ['error', { 
        'ObjectExpression': { 'multiline': true, 'minProperties': 8 },
        'ObjectPattern': { 'multiline': true, 'minProperties': 8 },
        'ImportDeclaration': { 'multiline': true, 'minProperties': 8 },
        'ExportDeclaration': { 'multiline': true, 'minProperties': 8 }
      }],
      'object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': true }],
      'array-bracket-spacing': ['error', 'never'],
      'array-bracket-newline': ['error', { 'multiline': true, 'minItems': 6 }],
      'array-element-newline': ['error', { 'multiline': true, 'minItems': 6 }],
      
      // Function formatting
      'function-paren-newline': ['error', 'never'],
      'function-call-argument-newline': ['error', 'never'],
      
      // Line length and spacing
      'max-len': ['warn', { 
        'code': 250, 
        'ignoreStrings': true, 
        'ignoreTemplateLiterals': true, 
        'ignoreComments': true,
        'ignoreUrls': true,
        'ignoreRegExpLiterals': true
      }],
      
      // Semicolons and commas
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'only-multiline'],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      
      // Disable rules that force multi-line
      'react/jsx-max-props-per-line': 'off',
      'react/jsx-first-prop-new-line': 'off',
      'react/jsx-closing-bracket-location': 'off',
      'react/jsx-one-expression-per-line': 'off',
      
      // Block formatting - encourage single line for simple blocks
      'block-spacing': ['error', 'always'],
      'keyword-spacing': ['error', { 'before': true, 'after': true }],
      
      // React hooks formatting
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
])
