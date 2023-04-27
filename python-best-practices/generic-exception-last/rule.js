function visit(node, filename, code) {
  if (!node.exceptClauses || node.exceptClauses.length <= 1) {
    return;
  }
  const allExceptions = node.exceptClauses.flatMap(e => e.exceptions).map(e => e.value);
  if (allExceptions.length === 0 || allExceptions.indexOf("Exception") === -1) {
    return;
  }

  const exceptionClauses = node.exceptClauses.slice(); // copy original list
  exceptionClauses.pop(); // remove last element

  exceptionClauses.forEach(clause => {
    const genericExceptionArray = clause.exceptions.filter(e => e.value === "Exception");
    if (genericExceptionArray.length > 0) {
      const genericException = genericExceptionArray[0];
      const error = buildError(genericException.start.line, genericException.start.col,
        genericException.end.line, genericException.end.col,
        "Generic exception must be last", "WARNING", "BEST_PRACTICES");
      addError(error);
    }

  });

}