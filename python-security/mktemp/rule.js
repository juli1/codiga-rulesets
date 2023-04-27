function visit(node) {
  if(!node.arguments || !node.arguments.values || !node.context) {
    return;
  }
  
  if (!node.functionName || node.functionName.value !== "mktemp") {
    return;
  }
  
  const arguments = node.arguments.values;
  const nbArguments = node.arguments.values.length;
  const allPackages = node.context.imports.filter(r => r.packages).flatMap(i => i.packages.map(p => p.name.str));
  const useTempfilePackage = allPackages.filter(i => i === "tempfile").length > 0;
  const importFrom = node.context.imports
  	.filter(r => r.pkg && r.pkg.value === "tempfile" && r.elements && r.elements.filter(e => e.name).map(e => e.name.value).includes("mktemp"));
	const useImportFrom = importFrom.length > 0;
  if (!useTempfilePackage && !useImportFrom){
    return;
  }
  

  if((useTempfilePackage && node.moduleOrObject && node.functionName && node.functionName.value === "mktemp" && node.moduleOrObject.value === "tempfile") ||
    (useImportFrom && node.functionName.value === "mktemp") ){
    const error = buildError(node.start.line, node.start.col, 
                             node.end.line, node.end.col, 
                             "mktemp is unsafe", "CRITICAL", "SECURITY");

    const edits = [];
    const edit = buildEditUpdate(node.functionName.start.line, node.functionName.start.col,
                                 node.functionName.end.line, node.functionName.end.col,
                                 "mkstemp");
    
    if(useImportFrom) {
      
       const addMissingImport = buildEditUpdate(importFrom[0].elements[0].start.line, importFrom[0].elements[0].start.col,
                                                importFrom[0].elements[0].end.line, importFrom[0].elements[0].end.col,
                                 								"mkstemp");
      edits.push(addMissingImport);
    }
    
    edits.push(edit);
    const fix = buildFix("use mkstemp instead", edits);
    addError(error.addFix(fix));
  }
  
}