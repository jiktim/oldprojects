var OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = exports = {
  "env": {
    "es6": true,
    "amd": true
  },

  extends: "eslint:recommended",
  // This line is required to fix "unexpected token" errors
  parser: "babel-eslint",

  "rules": {
    // Possible Errors (overrides from recommended set)
    "no-extra-parens": ERROR,
    "no-unexpected-multiline": ERROR,
    // All JSDoc comments must be valid
    "valid-jsdoc": [ERROR, {
      "requireReturn": false,
      "requireReturnDescription": false,
      "requireParamDescription": true,
      "prefer": {
        "return": "returns"
      }
    }],

    // Prevents eslint from being mad
    "no-async-promise-executor": OFF,
    "no-misleading-character-class": OFF,
    "no-useless-catch": OFF,

    // Allowed a getter without setter, but all setters require getters
    "accessor-pairs": [ERROR, {
      "getWithoutSet": false,
      "setWithoutGet": true
    }],
    "block-scoped-var": WARN,
    "consistent-return": OFF,
    "curly": OFF,
    "default-case": WARN,
    "dot-location": [WARN, "property"],
    "dot-notation": WARN,
    "eqeqeq": [OFF, "smart"],
    "guard-for-in": WARN,
    "no-alert": ERROR,
    "no-caller": ERROR,
    "no-case-declarations": WARN,
    "no-div-regex": WARN,
    "no-else-return": WARN,
    // "no-empty-label": WARN,
    "no-empty-pattern": WARN,
    "no-empty": OFF,
    "no-eq-null": WARN,
    "no-eval": OFF,
    "no-extend-native": ERROR,
    "no-extra-bind": WARN,
    "no-floating-decimal": WARN,
    "no-implicit-coercion": [WARN, {
      "boolean": true,
      "number": true,
      "string": true
    }],
    "no-implied-eval": ERROR,
    "no-invalid-this": OFF,
    "no-iterator": ERROR,
    "no-labels": WARN,
    "no-lone-blocks": WARN,
    "no-loop-func": ERROR,
    "no-magic-numbers": OFF,
    "no-multi-spaces": ERROR,
    "no-multi-str": WARN,
    "no-native-reassign": ERROR,
    "no-new-func": ERROR,
    "no-new-wrappers": ERROR,
    "no-new": ERROR,
    "no-octal-escape": ERROR,
    "no-param-reassign": OFF,
    "no-process-env": WARN,
    "no-proto": ERROR,
    "no-redeclare": ERROR,
    "no-return-assign": ERROR,
    "no-script-url": ERROR,
    "no-self-compare": ERROR,
    "no-throw-literal": ERROR,
    "no-unused-expressions": OFF,
    "no-useless-escape": OFF,
    "s-call": OFF,
    "no-useless-concat": ERROR,
    "no-void": WARN,
    "no-warning-comments": [WARN, {
      "terms": ["TODO", "FIXME"],
      "location": "start"
    }],
    "no-with": WARN,
    "radix": OFF,
    "vars-on-top": ERROR,
    // Enforces the style of wrapped functions
    "wrap-iife": [ERROR, "outside"],
    "yoda": ERROR,

    // Strict Mode - for ES6, never use strict.
    "strict": [ERROR, "never"],

    // Variables
    "init-declarations": [OFF, "always"],
    "no-catch-shadow": OFF,
    "no-delete-var": ERROR,
    "no-label-var": ERROR,
    "no-shadow-restricted-names": ERROR,
    "no-shadow": WARN,
    "no-undef-init": OFF,
    "no-undef": OFF,
    "no-undefined": OFF,
    "no-unused-vars": OFF,

    // Node.js and CommonJS
    "callback-return": [WARN, ["callback", "next"]],
    "global-require": OFF,
    "handle-callback-err": OFF,
    "no-mixed-requires": WARN,
    "no-new-require": ERROR,
    "no-path-concat": ERROR,
    "no-process-exit": OFF,
    "no-restricted-modules": OFF,
    "no-sync": WARN,

    // ECMAScript 6 support
    "arrow-body-style": [OFF, "always"],
    "arrow-parens": [OFF, "always"],
    "arrow-spacing": [ERROR, { "before": true, "after": true }],
    "constructor-super": ERROR,
    "generator-star-spacing": [ERROR, "before"],
    // "no-arrow-condition": ERROR,
    "no-console": OFF,
    "no-class-assign": ERROR,
    "no-const-assign": ERROR,
    "no-dupe-class-members": ERROR,
    "no-this-before-super": ERROR,
    "no-var": WARN,
    "object-shorthand": [WARN, "never"],
    "prefer-arrow-callback": WARN,
    "prefer-spread": WARN,
    "prefer-template": WARN,
    "require-yield": ERROR,
    "require-atomic-updates": OFF,

    // Stylistic - everything here is a warning because of style.
    "array-bracket-spacing": [OFF, "always"],
    "block-spacing": [WARN, "always"],
    "brace-style": [WARN, "1tbs", { allowSingleLine: true }],
    "comma-spacing": [WARN, { before: false, after: true }],
    "comma-style": [WARN, "last"],
    "computed-property-spacing": [WARN, "never"],
    "consistent-this": [WARN, "self"],
    "eol-last": WARN,
    indent: [OFF, 2],
    "jsx-quotes": [WARN, "prefer-double"],
    // "linebreak-style": [ WARN, "unix" ],
    "lines-around-comment": [WARN, { beforeBlockComment: true }],
    "max-depth": [WARN, 8],
    "max-nested-callbacks": [WARN, 8],
    "max-params": [WARN, 8],
    "new-parens": WARN,
    "no-array-constructor": WARN,
    "no-bitwise": OFF,
    "no-continue": OFF,
    "no-inline-comments": OFF,
    "no-lonely-if": WARN,
    "no-mixed-spaces-and-tabs": WARN,
    "no-multiple-empty-lines": WARN,
    "no-negated-condition": OFF,
    "no-nested-ternary": OFF,
    "no-new-object": WARN,
    "no-plusplus": OFF,
    "no-spaced-func": WARN,
    "no-ternary": OFF,
    "no-trailing-spaces": WARN,
    "no-underscore-dangle": OFF,
    "no-unneeded-ternary": WARN,
    "object-curly-spacing": [WARN, "always"],
    "one-var": OFF,
    "operator-linebreak": [WARN, "after"],
    "padded-blocks": [WARN, "never"],
    "quote-props": [WARN, "consistent-as-needed"],
    "semi-spacing": [WARN, { before: false, after: true }],
    "semi": [ERROR, "always"],
    "sort-vars": OFF,
    "space-before-blocks": [WARN, "always"],
    "space-before-function-paren": [OFF, "never"],
    "space-in-parens": [WARN, "never"],
    "space-infix-ops": [WARN, { int32Hint: true }],
    "space-unary-ops": ERROR,
    "spaced-comment": [WARN, "always"],
    "wrap-regex": OFF
  }
};
