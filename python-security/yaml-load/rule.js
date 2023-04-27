function visit(node, filename, code) {

  // If filename starts or ends with test_ or _test, do not do anything
  if (filename.includes("_test.py") || filename.startsWith("test_")) {
    return;
  }

  // if the function is not defined or not equal to "info"
  // we can return.
  if (!node.functionName || node.functionName.value !== "load") {
    return;
  }

  // If the analyzer did not get the arguments or if there is no argument, exit
  if (!node.arguments || !node.context || !node.arguments.values || node.arguments.values.length === 0) {
    return;
  }



  // Get the list of argument
  const arguments = node.arguments.values;
  const nbArguments = node.arguments.values.length;

  // Get all the package list that are imported with "import <name>"
  const allPackages = node.context.imports.filter(r => r.packages).flatMap(i => i.packages.map(p => p.name.str));

  // Do we use the logging package for Python?
  const useYamlPackage = allPackages.filter(i => i === "yaml").length > 0;

  const useByImport = useYamlPackage && node.moduleOrObject && node.moduleOrObject.value === "yaml";


  const importFromStatements = node.context.imports
    .filter(r => r.pkg && r.pkg.value === "yaml" && r.elements &&
      r.elements.filter(e => e.name).map(e => e.name.value).includes("load"));
  const importFrom = importFromStatements.length > 0;
  const useByImportFrom = importFrom && !node.moduleOrObject;


  const hasSafeLoader = arguments.filter(a => a.name && a.name === "Loader" && a.value && a.value.value.includes("SafeLoader")).length > 0;

  if (!hasSafeLoader && (useByImport || useByImportFrom)) {
    // build the error
    const error = buildError(node.functionName.start.line, node.functionName.start.col,
      node.functionName.end.line, node.functionName.end.col,
      "prefer using safe_load to avoid arbitrary code execution", "WARNING", "SECURITY");
    const edits = [];
    // build the fix (replace foo by bar)
    const edit = buildEditUpdate(node.functionName.start.line, node.functionName.start.col,
      node.functionName.end.line, node.functionName.end.col,
      "safe_load");
    if (importFrom) {
      console.log("additional fix");
      const elementToUpdate = importFromStatements[0].elements.filter(e => e.name && e.name.value === "load")[0];
      const editImportFrom = buildEditUpdate(elementToUpdate.start.line, elementToUpdate.start.col,
        elementToUpdate.end.line, elementToUpdate.end.col,
        "safe_load");
      edits.push(editImportFrom);
    }
    edits.push(edit);
    // build a fix with one edit
    const fix = buildFix("use safe_load", edits);

    // report an error with a fix
    addError(error.addFix(fix));
  }
}