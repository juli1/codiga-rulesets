import { useRef } from 'react';

function App() {
	const ref = useRef()
	
	return (
		<div ref={ref}>
			Hello World
		</div>
	)
}