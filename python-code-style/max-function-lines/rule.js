function visit(node, filename, code) {
  const lines = node.end.line - node.start.line;

  if (lines > 200) {
    const error = buildError(node.name.start.line, node.name.start.col,
      node.parameters.end.line ? node.parameters.end.line : node.name.end.line,
      node.parameters.end.col ? node.parameters.end.col : node.name.end.col,
      "function is too long", "MINOR", "DESIGN");
    addError(error);

  }
}