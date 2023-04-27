function visit(node, filename, code) {
  if (node.condition && node.condition.astType === "not") {
    if (node.condition.value && node.condition.value.astType === "not") {
      const error = buildError(
        node.condition.start.line, node.condition.start.col,
        node.condition.end.line, node.condition.end.col,
        "do not use two not", "MINOR", "DESIGN");
      addError(error);
    }
  }
}