const NAMES_TO_AVOID = ["Exception", "BaseException"];

const checkNode = (node) => {
  if (!node) {
    return;
  }
  if (node.astType === "sequence") {
    node.elements.forEach(e => checkNode(e));
  }
  if (node.astType === "functiondefinition") {
    checkNode(node.content);
  }
  if (node.astType === "ifstatement") {
    checkNode(node.statements);
    if (node.elseStatements) {
      checkNode(node.elseStatements.statements);
    }
    if (node.elifStatements) {
      node.elifStatements.forEach(e => checkNode(e.statements));
    }
  }

  if (node.astType === "forstatement") {
    checkNode(node.statements);
  }

  if (node.astType === "assignment") {
    const left = node.left;
    const right = node.right;

    if (left.astType === right.astType && left.astType === "string" && left.value === right.value) {
      const error = buildError(left.start.line, left.start.col,
        left.end.line, left.end.col,
        "do not assign a variable to itself", "WARNING", "DESIGN");

      addError(error);
    }
  }
};

function visit(node, filename, code) {
  checkNode(node);
}