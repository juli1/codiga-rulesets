const visitElement = (element, arguments) => {
  if (element.astType === "sequence") {
    element.elements.forEach(e => visitElement(e, arguments));
    return;
  }
  if (element.astType === "assignment") {
    const left = element.left;
    if (left.astType === "string" && arguments.indexOf(left.value) !== -1) {
      const error = buildError(element.left.start.line, element.left.start.col,
        element.left.end.line, element.left.end.col,
        "variable name is the same as a function parameter", "WARNING", "DESIGN");

      addError(error);
      return;
    }
  }
};

function visit(node, filename, code) {
  const parameterNames = node.parameters.values.filter(v => v.name).map(v => v.name.value);
  visitElement(node.content, parameterNames);
}