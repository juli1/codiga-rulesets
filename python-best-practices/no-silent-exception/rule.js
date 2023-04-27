function visit(node, filename, code) {
  const allClausesWithPass = node.exceptClauses
	  .filter(e => e.content && e.content.elements && e.content.elements.length == 1)
		.flatMap(e => e.content.elements).filter(e => e.astType === "pass");
  allClausesWithPass.forEach(c => {
    const error = buildError(c.start.line, c.start.col, c.end.line, c.end.col, "silent exception", "WARNING", "BEST_PRACTICES");
    addError(error);
  });
}