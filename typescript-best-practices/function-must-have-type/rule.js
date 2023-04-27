function visit(node, filename, code) {
  if (node.parameters && node.parameters.values && node.parameters.values.length > 0) {

    node.parameters.values.forEach(a => {
      if (!a.type && a.name) {
        const error = buildError(a.name.start.line, a.name.start.col,
          a.name.end.line, a.name.end.col,
          "add a type", "MINOR", "BEST_PRACTICE");
        const edit = buildEditAdd(
          a.name.end.line, a.name.end.col,
          ": unknown");
        const fix = buildFix("add unknown type (refine once added)", [edit]);

        addError(error.addFix(fix));
      }
    });

  }
}