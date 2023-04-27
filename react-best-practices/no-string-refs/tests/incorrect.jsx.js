var Hello = createReactClass({
 render: function() {
  return (
		<div>
			<div ref="hello">Hello, world.</div>
			<div ref={'morning'}>Good morning</div>
			<div ref={`night`}>Good night</div>
		</div>
	)
 }
});