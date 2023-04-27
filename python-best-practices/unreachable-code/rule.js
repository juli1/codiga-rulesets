const checkSequence = (node) => {
  if (node.astType !== "sequence") {
    return;
  }
  var hasReturn = false;
  for (var i = 0; i < node.elements.length; i++) {
    const element = node.elements[i];
    if (element.astType === "return" && i < node.elements.length - 1) {
      const errorFirst = node.elements[i + 1];
      const errorLast = node.elements[node.elements.length - 1];
      const edit = buildEditRemove(errorFirst.start.line, errorFirst.start.col,
        errorLast.end.line, errorLast.end.col);
      const fix = buildFix("remove unreachable code", [edit]);
      const error = buildError(errorFirst.start.line, errorFirst.start.col,
        errorLast.end.line, errorLast.end.col,
        "Avoid unreachable code", "WARNING", "DESIGN");

      // report an error with a fix
      addError(error.addFix(fix));
    }
  }


};

function visit(node, filename, code) {
  if (node.astType === "functiondefinition") {
    checkSequence(node.content);
  }
}