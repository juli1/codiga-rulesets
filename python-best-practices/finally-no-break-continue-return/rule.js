function visit(node, filename, code) {
  const flagElement = (element, typeToAvoid) => {
    const error = buildError(
      element.start.line, element.start.col,
      element.end.line, element.end.col,
      `do not use ${typeToAvoid} in finally block`, "ERROR", "BEST_PRACTICES");
    const edit = buildEditRemove(
      element.start.line, element.start.col,
      element.end.line, element.end.col);
    const fix = buildFix("remove statement", [edit]);
    addError(error.addFix(fix));
  }

  /**
   * Detect if there is a use of return, break or continue
   */
  const detectBreakOrContinue = (element) => {
    if (!element) {
      return;
    }

    if (element.astType === "sequence") {
      element.elements.forEach(e => detectBreakOrContinue(e));
    }

    if (element.astType === "break") {
      flagElement(element, "break");
    }

    if (element.astType === "continue") {
      flagElement(element, "continue");
    }
    if (element.astType === "return") {
      flagElement(element, "return");
    }
  };

  // trigger the rule if there is a finally clause only
  if (node.finallyClause) {
    const finallyClause = node.finallyClause;
    detectBreakOrContinue(finallyClause.content);
  }
}