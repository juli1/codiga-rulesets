const findEdits = (element, arrayName, indexName) => {
  var edits = [];
  if (element.astType === "sequence") {
    element.elements.forEach(e => {
      edits = edits.concat(findEdits(e, arrayName, indexName));
    });
  }

  if (element.astType === "functioncall") {
    element.arguments.values.forEach(e => {
      edits = edits.concat(findEdits(e, arrayName, indexName));
    });
  }

  if (element.value && element.astType === "argument") {
    return findEdits(element.value, arrayName, indexName);
  }

  if (element.astType === "assignment") {
    return findEdits(element.left, arrayName, indexName).concat(findEdits(element.right, arrayName, indexName));
  }

  if (element.astType === "variableindex" && element.variable.astType === "string" &&
    element.index.astType === "string" && element.index.value === indexName && element.variable.value === arrayName) {
    const replaceForContentEdit = buildEditUpdate(element.start.line,
      element.start.col,
      element.end.line,
      element.end.col,
      indexName);
    return [replaceForContentEdit];
  }


  return edits;
}

function visit(node, filename, code) {
	if(!node.right || node.right.astType !== "functioncall") {
		return;
	}

  if (node.right && node.right.astType === "functioncall" &&
    node.right.functionName.value === "range" && node.right.arguments &&
    node.right.arguments && node.right.arguments.values &&
		node.right.arguments.values.length > 0 && node.right.arguments.values[0].value.astType === "functioncall" &&
    node.right.arguments.values[0].value.functionName.value === "len" && node.left.astType === "string") {
		
		if(!node.right.arguments.values[0].value.arguments.values[0].value) {
			return;
		}
			
    const arg = node.right.arguments.values[0].value.arguments.values[0].value.str;
    const indexName = node.left.str;


    if (arg) {
      const replaceListEdit = buildEditUpdate(node.right.start.line, node.right.start.col, node.right.end.line, node.right.end.col, arg);
      const otherEdits = findEdits(node.statements, arg, indexName);
      const fix = buildFix("use the list directly", [replaceListEdit].concat(otherEdits));

      const error = buildError(node.right.start.line, node.right.start.col, node.right.end.line, node.right.end.col, `do not use range(len(${arg}))`, "INFO", "BEST_PRACTICE");
      addError(error.addFix(fix));
    }

  }

}