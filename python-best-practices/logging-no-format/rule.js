const FUNCTIONS = ["info", "warning", "error", "critical", "log", "exception"];

function visit(node, filename, code) {
  if (!node.functionName || node.functionName.astType !== "string" || !FUNCTIONS.includes(node.functionName.value)) {
    return;
  }
  if (!node.moduleOrObject || node.moduleOrObject.astType !== "string") {
    return;
  }
  if (node.moduleOrObject.value !== "logging") {
    return;
  }
  if (!node.arguments.values || node.arguments.values.length !== 1) {
    return;
  }

  const firstArgument = node.arguments.values[0].value;
  if (firstArgument && firstArgument.astType === "functioncall" && firstArgument.functionName &&
    firstArgument.functionName.astType === "string" && firstArgument.functionName.value === "format") {
    const error = buildError(firstArgument.start.line, firstArgument.start.col,
      firstArgument.end.line, firstArgument.end.col,
      "do not use format with logging", "INFO", "DESIGN");
    addError(error);
  }

}