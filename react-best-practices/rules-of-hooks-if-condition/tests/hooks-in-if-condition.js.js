function MyComp() {
  const { data, error } = useQuery();
  
  if (error) {
    // invalid
    const message = useMemo(() => error.message, []);
  }
  
  return <p>{message}</p>;
}