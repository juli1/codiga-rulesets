function visit(node, filename, code) {
	if(node.members.length === 0) {
		const error = buildError(
			node.start.line,
			node.start.col,
			node.end.line,
			node.end.col,
			`An empty interface is equivalent to "{}"`,
			"WARNING",
			"ERROR_PRONE"
		);
		
		addError(error);
	}
}