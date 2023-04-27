const myComponent = () => {
  const { data, loading } = useQuery();
  
  if (loading) {
    return (<div></div>);
  }
  
  // invalid
  useEffect(() => {
    // do something
  }, [data]);
  
  return (<div>data.example</div>);
}