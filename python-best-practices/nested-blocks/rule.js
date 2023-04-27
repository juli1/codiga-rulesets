const checkError = (element, nestingLevel, maxNestintLevel) => {
  if (nestingLevel >= maxNestintLevel) {
    const error = buildError(element.start.line, element.start.col,
      element.end.line, element.end.col,
      "too many nesting level", "WARNING", "DESIGN");

    addError(error);
  }

};

const check = (element, nestingLevel, maxNestintLevel) => {
  if (!element) {
    return;
  }
  if (element.astType === "ifstatement") {
    checkError(element, nestingLevel, maxNestintLevel);
    check(element.statements, nestingLevel + 1, maxNestintLevel);
    element.elifStatements.forEach(e => {
      check(e.statements, nestingLevel + 1, maxNestintLevel);
    });
    check(element.elseStatements, nestingLevel + 1, maxNestintLevel);
  }

  if (element.astType === "forstatement") {
    checkError(element, nestingLevel);
    check(element.statements, nestingLevel + 1, maxNestintLevel);
  }

  if (element.astType === "sequence") {
    element.elements.forEach(e => check(e, nestingLevel, maxNestintLevel));
  }

  if (element.astType === "elifstatement") {
    element.statements.elements.forEach(e => check(e, nestingLevel, maxNestintLevel));
  }
  if (element.astType === "elsestatement") {
    element.statements.elements.forEach(e => check(e, nestingLevel, maxNestintLevel));
  }
};

function visit(node, filename, code) {
	const maxNestingLevel = 4;
  check(node, 1, maxNestingLevel);
}