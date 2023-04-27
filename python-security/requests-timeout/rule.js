function visit(node) {
  if(!node.arguments || !node.arguments.values || !node.context) {
    return;
  }
  
  const functions = ["post", "get", "put", "patch"];
  
  if (! node.functionName || !functions.includes(node.functionName.value)) {
    return;
  }
  
  const arguments = node.arguments.values;
  const nbArguments = node.arguments.values.length;
  const allPackages = node.context.imports.filter(r => r.packages).flatMap(i => i.packages.map(p => p.name.str));
  const useRequestsPackage = allPackages.filter(i => i === "requests").length > 0;


  const hasTimeout = node.arguments.values.filter(a => a.name && a.name.value == "timeout").length > 0;
  
  functions.forEach(functionName => {
    const importFrom = node.context.imports
    	.filter(r => r.pkg && r.pkg.value === "requests" && r.elements && r.elements.filter(e => e.name).map(e => e.name.value).includes(functionName));
		const useImportFrom = importFrom.length > 0;

    if((useRequestsPackage && !hasTimeout && node.moduleOrObject && node.functionName && node.functionName.value === functionName && node.moduleOrObject.value === "requests")
      || (useImportFrom && node.functionName.value === functionName && !hasTimeout)){
    const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, "timeout not defined", "CRITICAL", "SAFETY");
    const lineToInsert = arguments[arguments.length - 1].end.line;
    const colToInsert = arguments[arguments.length - 1].end.col;
    const edit = buildEditAdd(lineToInsert, colToInsert, ", timeout=5")
    const fix = buildFix("add timeout argument", [edit]);
    addError(error.addFix(fix));
  }
  });
  
}