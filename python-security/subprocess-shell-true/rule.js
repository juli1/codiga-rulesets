function visit(node, filename, code) {
  if (!node.arguments || !node.context || !node.arguments.values || !node.functionName){
    return;
  }
  
  const functions = ["Popen", "run", "call"];
  
  if (!functions.includes(node.functionName.value)) {
    return;
  }
  
  functions.forEach(functionName => {
    const hasShellTrue = node.arguments.values.filter(a => a.name && a.name.value == "shell" && a.value && a.value.value == "True").length > 0;
    const allPackages = node.context.imports.filter(i => i.packages).flatMap(i => i.packages.map(p => p.name.str));
    const useSubprocessPackage = allPackages.filter(i => i === "subprocess").length > 0;
    const importFrom = node.context.imports
        .filter(r => r.pkg && r.pkg.value === "subprocess" && r.elements && r.elements.filter(e => e.name).map(e => e.name.value).includes(functionName));
    const useImportFrom = importFrom.length > 0;
    if((hasShellTrue && useSubprocessPackage && node.functionName.value === functionName && node.moduleOrObject.value === "subprocess")||
       (useImportFrom && node.functionName.value === functionName)){
      
      
      for (var i = 0 ; i < node.arguments.values.length ; i++) {
        const arg = node.arguments.values[i];
        const nbArguments = node.arguments.values.length;
        if(arg.name && arg.name.value == "shell" && arg.value && arg.value.value == "True") {
          var error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, "shell defined with true", "CRITICAL", "SECURITY");


					if(i > 0) {
           const previousArgument = node.arguments.values[i-1];
           const edit = buildEditRemove(previousArgument.end.line, previousArgument.end.col,
                                        arg.end.line, arg.end.col)
    			 const fix = buildFix("remove shell argument", [edit]);
           error = error.addFix(fix);
          }

          
					 addError(error);
        }
      }      
    }
  });
}