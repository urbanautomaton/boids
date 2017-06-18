module.exports = {
    "extends": "airbnb-base",
    "parserOptions": {
      "ecmaVersion": 8,
      "sourceType": "module",
    },
    "plugins": [
        "import"
    ],
    "globals": {
      "document": true,
      "window": true
    },
    "rules": {
      "no-multi-spaces": ["error",
        { exceptions: { "AssignmentExpression": true } }
      ]
    }
};
