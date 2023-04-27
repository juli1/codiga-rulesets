function visit(node, filename, code) {
  if (!node || !node.parameters || !node.parameters.values) {
    return;
  }

  const parameters = node.parameters.values;
  for (var i = 0; i < parameters.length; i++) {

    const param1 = parameters[i];
    if (!param1 || !param1.name) {
      continue;
    }
    const paramValue1 = param1.name.value;
    for (var j = i + 1; j < parameters.length; j++) {
      const param2 = parameters[j];
      if (!param2 || !param2.name) {
        continue;
      }
      const paramValue2 = param2.name.value;
      if (paramValue1 === paramValue2) {
        const error = buildError(param2.start.line, param2.start.col,
          param2.end.line, param2.end.col,
          `Parameter with name ${paramValue1} already defined`,
          "CRITICAL", "DESIGN");

        addError(error);
      }
    }
  }
}