function MyComp() {
  const [params, setParams] = useState();
  
  if (params) {
    // invalid
    useEffect(() => {
      // do something
    }, []);
  }
  
  return <p>wrong</p>;
}