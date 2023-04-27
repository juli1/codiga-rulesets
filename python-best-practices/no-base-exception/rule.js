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

  if (node.astType === "raisestatement") {
    var exceptionWarning = null;
    if (!node.exception) {
      const error = buildError(node.start.line, node.start.col,
										 					 node.end.line, node.end.col,
															 "Please specify an exception to raise", "WARNING", "BEST_PRACTICE");

      addError(error);
      return;
    }
    if (node.exception.astType === "string") {
      if (NAMES_TO_AVOID.indexOf(node.exception.value) !== -1) {
        exceptionWarning = node.exception;
      }
    }
    if (node.exception.astType === "functioncall") {
      if (node.exception.functionName && NAMES_TO_AVOID.indexOf(node.exception.functionName.value) !== -1) {
        exceptionWarning = node.exception.functionName;
      }
    }

    if (exceptionWarning) {
      const error = buildError(exceptionWarning.start.line, exceptionWarning.start.col,
        exceptionWarning.end.line, exceptionWarning.end.col,
        `${exceptionWarning.value} is too generic`, "WARNING", "BEST_PRACTICE");

      addError(error);
    }
  }
};

function visit(node, filename, code) {
  checkNode(node);
}