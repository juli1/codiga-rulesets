function visit(node, filename, code) {
	const enterMethodFiltered = node.content.elements.filter(e => e.astType === "functiondefinition" && e.name.value === "__enter__");
	const hasEnter = enterMethodFiltered && enterMethodFiltered.length > 0;
	
	const exitMethodFiltered = node.content.elements.filter(e => e.astType === "functiondefinition" && e.name.value === "__exit__");
	const hasExit = enterMethodFiltered && exitMethodFiltered.length > 0;
	if(hasEnter && !hasExit) {
		const enterMethod = enterMethodFiltered[0];
		const error = buildError(enterMethod.name.start.line, enterMethod.name.start.col, 
														 enterMethod.name.end.line, enterMethod.name.end.col, 
														 "__enter__ defined but __exit__ not defined. Define __exit__", "INFO", "BEST_PRACTICE");
    addError(error);
	}
	if(!hasEnter && hasExit) {
		const exitMethod = exitMethodFiltered[0];
		const error = buildError(exitMethod.name.start.line, exitMethod.name.start.col, 
														 exitMethod.name.end.line, exitMethod.name.end.col, 
														 "__exit__ defined but __enter__ not defined. Define __enter__", "INFO", "DESIGN");
    addError(error);
	}
}