function visit(node) {

  if (!node.context) {
    return;
  }

  if (!node.functionName || node.functionName.value !== "_create_unverified_context") {
    return;
  }
  console.log("here");

  const allPackages = node.context.imports.filter(r => r.packages).flatMap(i => i.packages.map(p => p.name.str));
  const useSslPackage = allPackages.filter(i => i === "ssl").length > 0;

  if (!useSslPackage) {
    return;
  }
  console.log("here");

  if (useSslPackage && node.moduleOrObject && node.moduleOrObject.value === "ssl") {
    const error = buildError(node.start.line, node.start.col,
      node.end.line, node.end.col,
      "use of _create_unverified_context bypass SSL security", "CRITICAL", "SECURITY");

    addError(error);
  }

}