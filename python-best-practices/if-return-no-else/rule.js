function visit(node, filename, code) {
	if(! node || !node.statements || !node.elseStatements) {
		return;
	}
  const hasReturn = node.statements && node.statements.astType === "sequence" && node.statements.elements.filter(e => e.astType === "return").length > 0;
  const hasElse = node.elseStatements.statements.elements && node.elseStatements.statements.elements.length > 0;
  if (hasReturn && hasElse) {
    const error = buildError(node.elseStatements.start.line, node.elseStatements.start.col,
      node.elseStatements.end.line, node.elseStatements.end.col,
      "else is not necessary since the if clause has a return",
      "WARNING", "DESIGN");
    addError(error);

  }
}