const visitElement = (element) => {
  if (element.astType !== "functiondefinition") {
    return;
  }

  const decoratorNames = element.decorators.map(d => d.name.value);
  if (decoratorNames.indexOf("staticmethod") !== -1) {
    return;
  }
	if (decoratorNames.indexOf("classmethod") !== -1) {
    return;
  }
  if (element.parameters && element.parameters.values && element.parameters.values.length >= 1) {
    const firstParameter = element.parameters.values[0];
    if (firstParameter.name.value !== "self") {
      const error = buildError(
        firstParameter.name.start.line, firstParameter.name.start.col,
        firstParameter.name.end.line, firstParameter.name.end.col,
        "first parameter of a class function should be self", "MINOR", "DESIGN");
			
			const edit = buildEditUpdate(firstParameter.name.start.line, firstParameter.name.start.col, 
																	 firstParameter.name.end.line, firstParameter.name.end.col, "self");
    	const fix = buildFix("use self", [edit]);
    	addError(error.addFix(fix));
    }
  }
};

function visit(node, filename, code) {

  node.content.elements.forEach(v => {
    visitElement(v);
  });
}