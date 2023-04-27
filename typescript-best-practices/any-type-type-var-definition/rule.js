function visit(node, filename, code) {
  if (!node.type) {
    return;
  }

  if (node.type.astType !== "string") {
    return;
  }
  if (node.type.value === "any") {
    const error = buildError(node.type.start.line, node.type.start.col,
      node.type.end.line, node.type.end.col,
      "do not use any", "CRITICAL", "SAFETY");
    const edit = buildEditUpdate(
      node.type.start.line, node.type.start.col,
      node.type.end.line, node.type.end.col,
      "unknown");
    const fix = buildFix("use unknown instead", [edit]);

    addError(error.addFix(fix));
  }

}