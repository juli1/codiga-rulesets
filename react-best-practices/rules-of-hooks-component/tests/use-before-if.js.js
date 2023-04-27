const myComponent = () => {
  const { data, loading } = useQuery();
  
	// invalid
  useEffect(() => {
    // do something
  }, [data]);
  
  if (loading) {
    return (<div></div>);
  }
  

  return (<div>data.example</div>);
}