function visit(node) {
  const genericExceptions = node.exceptClauses.flatMap(e => e.exceptions.filter(e => e.str === "Exception"));

  for (var i = 0 ; i < genericExceptions.length ; i++) {
    exception = genericExceptions[i];
    const error = buildError(exception.start.line, exception.start.col, exception.end.line, exception.end.col, "generic exception", "WARNING", "BEST_PRACTICES");
    addError(error);
  }
}