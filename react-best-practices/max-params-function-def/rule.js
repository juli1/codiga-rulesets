const MAX_PARAMS = 5;

function visit(node, filename, code) {
  if (!node.parameters) return;
  if (node.parameters?.values.length < MAX_PARAMS) return;

  const error = buildError(
    node.name.start.line,
    node.name.start.col,
    node.name.end.line,
    node.name.end.col,
    `Having this many parameters can be difficult to manage. Consider splitting this function.`,
    "INFORMATIONAL",
    "BEST_PRACTICES"
  );
  addError(error);
}