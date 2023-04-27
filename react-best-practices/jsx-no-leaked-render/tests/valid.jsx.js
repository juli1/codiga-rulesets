import List from './List';

const ComponentTwo = ({ elements }) => {
  return (
		<div>
			{!!elements && <List elements={elements} />}
		</div>
	)
}