const MyComp = () => {
  const [payload, setPayload] = useState();
  const [result, setResult] = useState();
  
  const handleClick = () => {
    // invalid
    setPayload(useContext(MyContext));
  };
  
  useEffect(() => {
    fetch(payload).then((res) => {
      setResult(res);
    });
  }, [payload]);

  return <button onClick={handleClick}>my button</button>;
}