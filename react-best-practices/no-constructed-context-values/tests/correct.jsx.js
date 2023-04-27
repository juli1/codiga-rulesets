const foo = useMemo(() => ({ foo: 'bar' }), []);

return (
  <SomeContext.Provider value={foo}>
        {children}
	</SomeContext.Provider>
)