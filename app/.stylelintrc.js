module.exports = {
  defaultSeverity: 'warning',
  plugins: ['./config/custom-plugins/stylelint'],
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-prettier/recommended',
  ],
  rules: {
     // Rules that are auto-fixable
    'color-function-notation': 'modern',
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested', 'inside-block'],
      },
    ],
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates-with-different-values'],
      },
    ],
    'length-zero-no-unit': true,
    'alpha-value-notation': 'number',
    'media-feature-range-notation': 'prefix',
    'font-family-name-quotes': 'always-unless-keyword',
    'declaration-empty-line-before': 'never',
    'color-hex-length': 'short',
    // Rules that are turned off
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'media-feature-name-no-vendor-prefix': null,
    'value-keyword-case': null,
    'at-rule-empty-line-before': null,
    'comment-empty-line-before': null,
    'keyframes-name-pattern': null,
    'no-descending-specificity': null,
    'number-max-precision': null,
    'scss/dollar-variable-empty-line-before': null,
    'scss/dollar-variable-pattern': null,
  }
}
