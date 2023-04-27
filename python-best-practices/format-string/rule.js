function visit(node, filename, code) {
	if(!node || !node.functionName || !node.moduleOrObject) {
		return;
	}
	
  if (node.functionName.astType !== "string" || node.moduleOrObject.astType !== "string") {
    return;
  }
  if (node.functionName.value !== "format") {
    return;
  }
  const formatArgumentsCount = node.arguments.values.length;
  const str = node.moduleOrObject.value;
  const pattern = /\{[^{}]*\}/g;
  const formatStringValuesCount = (str.match(pattern) || []).length;


  if (formatStringValuesCount !== formatArgumentsCount) {
    const error = buildError(node.start.line, node.start.col,
      node.end.line, node.end.col,
      "Number of arguments mismatch", "CRITICAL", "SECURITY");

    addError(error);
  }

}