function visit(node, filename, code) {
  if (node.astType === "assert" && node.value.astType === "tuple") {
    reportError(node.start.line, node.start.col,
      node.end.line, node.end.col,
      "do not assert on tuples", "CRITICAL", "SAFETY");
  }
}