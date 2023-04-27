const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const useCamelCase = (string) => /[A-Z]/.test(string);

function visit(node, filename, code) {
  const functionName = node.name.value;
	if(useCamelCase(functionName)) {
    const error = buildError(node.name.start.line, node.name.start.col, 
                             node.name.end.line, node.name.end.col, 
                             "use snake_case and not camelCase", "MINOR", "BEST_PRACTICES");
    const edit = buildEditUpdate(node.name.start.line, node.name.start.col,
                                 node.name.end.line, node.name.end.col, camelToSnakeCase(functionName));
    const fix = buildFix("convert to snake_case", [edit]);
    addError(error.addFix(fix));
  }
  
  if(node.parameters && node.parameters.values) {
    node.parameters.values.forEach(parameter => {
      const parameterName = parameter.name;
      
      	if(useCamelCase(parameterName.value)) {
    			const error = buildError(parameterName.start.line, parameterName.start.col, 
                             			 parameterName.end.line, parameterName.end.col, 
                             			"use snake_case and not camelCase", "MINOR", "BEST_PRACTICES");
    			const edit = buildEditUpdate(parameterName.start.line, parameterName.start.col,
                                 parameterName.end.line, parameterName.end.col, camelToSnakeCase(parameterName.value));
    			const fix = buildFix("convert to snake_case", [edit]);
    			addError(error.addFix(fix));
  			} 
    });
  }
}