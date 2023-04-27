function visit(node) {
  if (node.condition && node.condition.rightSide && node.condition.operator && node.condition.operator === "==" &&
    node.condition.rightSide.astType === "string" && node.condition.rightSide.value === "True" &&
    node.condition.leftSide && node.condition.leftSide.astType === "string") {
    const leftSide = node.condition.leftSide.value;

    const error = buildError(node.condition.start.line, node.condition.start.col, node.condition.end.line, node.condition.end.col, "do not make equal with true", "INFO", "BEST_PRACTICE");

    const editReplaceCondition = buildEditUpdate(node.condition.start.line, node.condition.start.col,
      node.condition.end.line, node.condition.end.col, leftSide)


    const fix = buildFix("remove True", [editReplaceCondition]);
    addError(error.addFix(fix));
  }
}