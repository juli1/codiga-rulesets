const regex = new RegExp("^[_$A-Za-z][$A-Za-z0-9]*$|^[_$A-Z][_$A-Z0-9]+$");

function visit(node, filename, code) {
  if (!node || !node.name || !node.name.value) return;

  const value = node.name.value;


  if (regex.test(value)) return;

  const error = buildError(
    node.name.start.line,
    node.name.start.col,
    node.name.end.line,
    node.name.end.col,
    `Variable follows an inconsistent naming convention`,
    "INFORMATIONAL",
    "CODE_STYLE"
  );

  addError(error);
}