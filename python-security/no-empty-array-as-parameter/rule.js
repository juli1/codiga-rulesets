function visit(node) {
  if (node.parameters && node.parameters.values) {
    const parametersWithEmptyArray = node.parameters.values.filter(p => p && p.defaultValue && p.defaultValue.value === "[]");

    for(var i = 0 ; i < parametersWithEmptyArray.length ; i++) {
      const parameter = parametersWithEmptyArray[i];
      const error = buildError(parameter.defaultValue.start.line, parameter.defaultValue.start.col, parameter.defaultValue.end.line, parameter.defaultValue.end.col, "cannot use default initializer [] in function", "CRITICAL", "SAFETY");
      addError(error);
    }
  }
}