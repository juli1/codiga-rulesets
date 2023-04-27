function visit(node, filename, code) {
  if (!node || !node.modifier || !node.modifier.value) return;

  if (node.modifier.value === "var") {
    const error = buildError(
      node.modifier.start.line,
      node.modifier.start.col,
      node.modifier.end.line,
      node.modifier.end.col,
      `Unexpected var, use let or const instead`,
      "INFORMATIONAL",
      "BEST_PRACTICE"
    );

    const letEdit = buildEditUpdate(
      node.modifier.start.line,
      node.modifier.start.col,
      node.modifier.end.line,
      node.modifier.end.col,
      "let"
    );

    const constEdit = buildEditUpdate(
      node.modifier.start.line,
      node.modifier.start.col,
      node.modifier.end.line,
      node.modifier.end.col,
      "const"
    );

    const letFix = buildFix("replace with let", [letEdit]);
    const constFix = buildFix("replace with const", [constEdit]);

    addError(error.addFix(letFix).addFix(constFix));
  }
}