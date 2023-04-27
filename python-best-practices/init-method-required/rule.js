function visit(node, filename, code) {
  const hasDecorators = node.decorators.length > 0;
  const hasInitMethod = node.content.elements
    .filter(e => e.astType === "functiondefinition")
    .filter(e => e.name && e.name.value === "__init__")
    .length > 0;

  if (!hasDecorators && !hasInitMethod && node.name) {
    const error = buildError(node.name.start.line, node.name.start.col,
      node.name.end.line, node.name.end.col,
      `Class ${node.name.value} should have an init method`, "CRITICAL", "SECURITY");

    addError(error);
  }

}