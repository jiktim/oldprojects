var OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = exports = {
  env: {
    es6: true
  },

  extends: "eslint:recommended",
  parser: "babel-eslint", // This line is required to fix "unexpected token" errors

  rules: {
    // Possible Errors (overrides from recommended set)
    "no-extra-parens": ERROR,
    "no-unexpected-multiline": ERROR,
    // All JSDoc comments must be valid
    "valid-jsdoc": [
      ERROR,
      {
        requireReturn: false,
        requireReturnDescription: false,
        requireParamDescription: true,
        prefer: {
          return: "returns"
        }
      }
    ],

    // Best Practices

    // Allowed a getter without setter, but all setters require getters
    "accessor-pairs": [
      ERROR,
      {
        getWithoutSet: false,
        setWithoutGet: true
      }
    ],
    "block-scoped-var": OFF,
    // the dot goes with the property when doing multiline
    "dot-location": [WARN, "property"],
    "dot-notation": WARN,
    "guard-for-in": WARN,
    "no-alert": ERROR,
    "no-caller": ERROR,
    "no-case-declarations": WARN,
    "no-div-regex": WARN,
    "no-empty": OFF,
    "no-empty-pattern": WARN,
    "no-eval": OFF,
    "no-extend-native": ERROR,
    "no-extra-bind": WARN,
    "no-floating-decimal": WARN,
    "no-implicit-coercion": [
      WARN,
      {
        boolean: true,
        number: true,
        string: true
      }
    ],
    "no-implied-eval": ERROR,
    "no-invalid-this": OFF,
    "no-iterator": ERROR,
    "no-labels": WARN,
    "no-lone-blocks": WARN,
    "no-loop-func": ERROR,
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
    "no-redeclare": OFF,
    "no-return-assign": OFF,
    "no-script-url": ERROR,
    "no-inner-declarations": OFF,
    "no-self-compare": ERROR,
    "no-throw-literal": ERROR,
    "no-useless-call": ERROR,
    "no-useless-catch": OFF,
    "no-useless-escape": OFF,
    "no-useless-concat": ERROR,
    "no-void": WARN,
    // Produce warnings when something is commented as TODO or FIXME
    "no-warning-comments": [
      WARN,
      {
        terms: ["TODO", "FIXME"],
        location: "start"
      }
    ],
    "no-with": WARN,
    "vars-on-top": OFF,
    // Enforces the style of wrapped functions
    "wrap-iife": [ERROR, "outside"],
    yoda: ERROR,

    // Strict Mode - for ES6, never use strict.
    strict: [ERROR, "never"],

    // Variables
    "no-catch-shadow": OFF,
    "no-delete-var": ERROR,
    "no-label-var": ERROR,
    "no-shadow-restricted-names": ERROR,
    "no-shadow": OFF,
    "no-unused-vars": OFF,
    // We require all vars to be initialized (see init-declarations)
    // If we NEED a var to be initialized to undefined, it needs to be explicit
    "no-undef-init": OFF,
    "no-undef": OFF,
    "no-undefined": OFF,
    // Disallow hoisting - let & const don't allow hoisting anyhow
    "no-use-before-define": OFF,

    // Node.js and CommonJS
    "callback-return": [WARN, ["callback", "next"]],
    "no-mixed-requires": WARN,
    "no-new-require": ERROR,
    // Use path.concat instead
    "no-path-concat": ERROR,
    "no-restricted-modules": OFF,
    "no-sync": WARN,

    // ECMAScript 6 support
    "arrow-spacing": [ERROR, { before: true, after: true }],
    "constructor-super": ERROR,
    "generator-star-spacing": [ERROR, "before"],
    "no-class-assign": ERROR,
    "no-const-assign": ERROR,
    "no-dupe-class-members": ERROR,
    "no-this-before-super": ERROR,
    "no-var": OFF,
    "require-atomic-updates": OFF,
    "no-console": OFF,
    "object-shorthand": [WARN, "never"],
    "prefer-arrow-callback": WARN,
    "prefer-spread": WARN,
    "prefer-template": WARN,
    "require-yield": ERROR,

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
    "no-nested-ternary": WARN,
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
    "quote-props": [OFF, "consistent-as-needed"],
    "semi-spacing": [WARN, { before: false, after: true }],
    semi: [ERROR, "always"],
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
