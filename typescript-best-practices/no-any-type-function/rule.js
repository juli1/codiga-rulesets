function visit(node, filename, code) {
  // check that we have more than one argument
  if (node.parameters && node.parameters.values && node.parameters.values.length > 0) {

    node.parameters.values.forEach(a => {
      if (a.type && a.type.astType === "string" && a.type.value === "any") {
        const error = buildError(a.type.start.line, a.type.start.col, a.type.end.line, a.type.end.col, "do not use any", "CRITICAL", "SAFETY");
        const edit = buildEditUpdate(
          a.type.start.line, a.type.start.col,
          a.type.end.line, a.type.end.col,
          "unknown");
        const fix = buildFix("use unknown instead", [edit]);

        addError(error.addFix(fix));
      }
    });

  }
}