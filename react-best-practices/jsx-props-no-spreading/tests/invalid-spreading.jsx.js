function Container(props){
  const rest = props
  const restOfProps = rest
  
  return (
    <div>
      <div {...props} />
      <div {...rest} />
      <div {...restOfProps} />
      <div {...rest, ...props} />
	  </div>
  )
}  