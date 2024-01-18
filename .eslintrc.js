module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        // "node": true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'overrides': [
        {
            'env': {
                'node': true
            },
            'files': [
                '.eslintrc.{js,cjs}'
            ],
            'parserOptions': {
                'sourceType': 'script'
            }
        }
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        'react'
    ],
    'globals':{
        'require': true,
        'process': true,
        'module': 'readonly',
        '__filename': true,
        '__dirname': true
    },
    'rules': {
        'semi': ['error', 'never'],
        'quotes': ['warn', 'single'],
        'no-console': ['off']
    }
}
