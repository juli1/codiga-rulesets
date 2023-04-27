There were two ways supported by React to refer to components. 

The first way, providing a string identifier, is now considered legacy in the official documentation. 

The documentation now prefers a second method -- referring to components by setting a property on the `this` object in the reference callback or setting the `ref` value given from `React.useRef`.

View a similar ESLint, [react/no-string-refs](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md).