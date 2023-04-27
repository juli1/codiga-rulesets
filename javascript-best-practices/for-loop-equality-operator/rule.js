const EQUALITY_OPERATORS = [
  "!=",
  "=="
];

function visit(node, filename, code) {
  if (!node.test.elements) return;

  const operator = node.test.elements[0]?.operator;
  if (!operator) return;

  if (!operator.right || operator.right.value === "null") return;

  if (!EQUALITY_OPERATORS.some(op => operator.value.includes(op))) return;

  const error = buildError(
    operator.start.line,
    operator.start.col,
    operator.end.line,
    operator.end.col,
    `Using an equality operator to terminate a for loop can cause infinite loops `,
    "WARNING",
    "ERROR_PRONE"
  );

  addError(error);
}