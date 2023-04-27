const MAX_PARAMS = 5;

function visit(node, filename, code) {
  if (!node || !node.right) return;
	
	// if the right side isn't a function, skip it
  if (node.right.astType !== 'functiondefinition') return;
  
	// if the function doesn't have an parameters, skip it
	if (!node.right.parameters) return;
	
	// if the function has less than the max, skip it
  if (node.right.parameters?.values.length < MAX_PARAMS) return;

  const error = buildError(
    node.right.parameters.start.line,
    node.right.parameters.start.col,
    node.right.parameters.end.line,
    node.right.parameters.end.col,
    `Having this many parameters can be difficult to manage. Consider splitting this function.`,
    "INFORMATIONAL",
    "BEST_PRACTICES"
  );

  addError(error);
}