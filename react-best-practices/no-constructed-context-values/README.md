This rule warns when you've set the value prop of a `Context.Provider` as a non-stable value (i.e. object identities).

Fixing your value prop by placing it higher in a `useMemo` or `useCallback` hook can save you unnecessary re-renders.

ESLint has a similar rule [react/jsx-no-constructed-context-values](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-constructed-context-values.md)