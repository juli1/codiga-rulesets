function visit(node, filename, code) {
  if (node.astType === "functiondefinition") {
    if (node.parameters.values.length > 4) {
      addError(buildError(
        node.start.line,
        node.start.col,
        node.end.line,
        node.end.col,
        `A long parameter list can indicate that a new structure should be created to wrap the numerous parameters or that the function is doing too many things.`,
        `INFORMATIONAL`,
        `BEST_PRACTICES`,
      ));
    }
  }
}