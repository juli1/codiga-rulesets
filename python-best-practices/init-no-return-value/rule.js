const findReturns = (element) => {
  if (element.astType === "sequence") {
    element.elements.forEach(e => findReturns(e));
  }
  if (element.astType === "return") {
    const edit = buildEditRemove(element.start.line, element.start.col,
      element.end.line, element.end.col);
    const fix = buildFix("remove return statement", [edit]);

    const error = buildError(
      element.start.line, element.start.col,
      element.end.line, element.end.col,
      "no return in __init__ method", "INFORMATION", "BEST_PRACTICE");

    addError(error.addFix(fix));
  }
};

function visit(node, filename, code) {
  const constructorFound = node.content.elements.filter(e => e.astType === "functiondefinition" && e.name && e.name.value === "__init__");
  if (constructorFound.length === 1) {
    const cons = constructorFound[0];
    findReturns(cons.content);

  }
}