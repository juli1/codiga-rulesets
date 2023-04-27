This rule will log a warning whenever a `href` or `to` prop starts with `javascript:`.

React considers this pattern as a dangerous attack surface.

In React 16.9, for any URLs starting with `javascript:` they will log a warning. In future major releases, React will throw an error if it encounters a `javascript:` URL.

View a similar rule from ESLint, [react/jsx-no-script-url](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-script-url.md).



