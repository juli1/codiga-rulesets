const useMyCustomHook = (isReady) => {
  if (!isReady){
		return;
	}
  
  // invalid
  const [state, setState] = useState();
  
  // invalid
  const myCallback = useCallback(() => {
    // invalid
    useEffect(function myEffect() {
      return;
    });
  }, []);
  
  // invalid 
  const value = useMemo(() => ({ state, myCallback}), []);
  
  return value;
}

