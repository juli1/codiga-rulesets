const alreadyImported = new Set([]);

function visit(node, filename, code) {
  if (node.astType === "importstatement") {
    const packages = node.packages.map(v => v.name).map(v => v.value);
    packages.forEach(e => {
      if (alreadyImported.has(e)) {
        const nodeWithError = node.packages.filter(v => v.name && v.name.value === e)[0];
        const error = buildError(nodeWithError.start.line, nodeWithError.start.col,
          nodeWithError.end.line, nodeWithError.end.col,
          "package already imported", "WARNING", "SECURITY");

        addError(error);
      } else {
        alreadyImported.add(e);
      }
    });
  }
  if (node.astType === "fromstatement") {
    const package = node.pkg.value;

    if (alreadyImported.has(package)) {
      const nodeWithError = node.pkg;
      const error = buildError(nodeWithError.start.line, nodeWithError.start.col,
        nodeWithError.end.line, nodeWithError.end.col,
        "package already imported", "WARNING", "SECURITY");

      addError(error);
    } else {
      alreadyImported.add(package);
    }

  }
}