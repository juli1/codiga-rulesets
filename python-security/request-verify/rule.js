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


  const hasVerify = node.arguments.values.filter(a => a.name && a.name.value === "verify" && a.value && a.value.value === "False").length > 0;
  
  functions.forEach(functionName => {
    const importFrom = node.context.imports
    	.filter(r => r.pkg && r.pkg.value === "requests" && r.elements && r.elements.filter(e => e.name).map(e => e.name.value).includes(functionName));
		const useImportFrom = importFrom.length > 0;

    if((useRequestsPackage && hasVerify && node.moduleOrObject && node.functionName && node.functionName.value === functionName && node.moduleOrObject.value === "requests")
      || (useImportFrom && node.functionName.value === functionName && hasVerify)){
    const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, "verify parameter is False", "CRITICAL", "SECURITY");
    const verifyArgument = node.arguments.values.filter(a => a.name && a.name.value == "verify")[0];

    const edit = buildEditUpdate(verifyArgument.value.start.line, verifyArgument.value.start.col, 
                                verifyArgument.value.end.line, verifyArgument.value.end.col, "True");
    const fix = buildFix("replace with True", [edit]);
    addError(error.addFix(fix));
  }
  });
  
}