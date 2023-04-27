function visit(node, filename, code) {
  if (filename.includes("_test.py") || filename.startsWith("test_")) {
  	return;
	}
  
  if(!node.functionName || !node.context){
    return;
  }
  if(node.functionName.value !== "randrange" && node.functionName.value !== "random"){
    return;
  }
  
  const allPackages = node.context.imports.filter(r => r.packages).flatMap(i => i.packages.map(p => p.name.str));
  const useRandomPackage = allPackages.filter(i => i === "random").length > 0;
  const useSecretsPackage = allPackages.filter(i => i === "secrets").length > 0;
  const importRandomFunctionFrom = node.context.imports
  	.filter(r => r.pkg && r.pkg.value === "random" && r.elements && r.elements.filter(e => e.name).map(e => e.name.value).includes("random")).length > 0;
	const importRandRangeFunctionFrom = node.context.imports
  	.filter(r => r.pkg && r.pkg.value === "random" && r.elements && r.elements.filter(e => e.name).map(e => e.name.value).includes("randrange")).length > 0;
  
	const edits = [];


  if(!node.functionName){
    return;
  }

  const editAddImport = buildEditAdd(1, 1, "import secrets\n");
  
  if(useRandomPackage && node.moduleOrObject && 
     node.functionName && node.functionName.value === "random" && 
     node.moduleOrObject.value === "random"){
    const hasArguments = (node.arguments && node.arguments.values && node.arguments.values && node.arguments.values.length > 0) || false;
  	
    var error = buildError(node.start.line, node.start.col, 
                           node.end.line, node.end.col, 
                          "do not use random", "WARNING", "SECURITY");

    if(!hasArguments) {
          
     	const edit = buildEditUpdate(node.start.line, node.start.col,
                                   node.end.line, node.end.col,
                                   "secrets.randbelow(100) / 100");
      edits.push(edit);
      if(!useSecretsPackage){
        edits.push(buildEditAdd(1, 1, "import secrets\n"));
      }
      const fix = buildFix("use secrets.randbelow instead", edits);
      error = error.addFix(fix);
    }
    
   	addError(error);
  }
  if(importRandomFunctionFrom && 
     node.functionName && node.functionName.value === "random"){
    const hasArguments = (node.arguments && node.arguments.values && 
                          node.arguments.values && node.arguments.values.length > 0) || false;
  	
    var error = buildError(node.start.line, node.start.col, 
                           node.end.line, node.end.col, 
                          "do not use random", "WARNING", "SECURITY");

    if(!hasArguments) {
          
     	const edit = buildEditUpdate(node.start.line, node.start.col,
                                   node.end.line, node.end.col,
                                   "secrets.randbelow(100) / 100");
      edits.push(edit);
      if(!useSecretsPackage){
        edits.push(buildEditAdd(1, 1, "import secrets\n"));
      }
      const fix = buildFix("use secrets.randbelow instead", edits);
      error = error.addFix(fix);
    }
    
    const editAddImport = buildEditAdd(1, 1, "import sys\n");
   	addError(error);
  }
  if(useRandomPackage && node.moduleOrObject && 
     node.functionName && node.functionName.value === "randrange" && 
     node.moduleOrObject.value === "random"){
    const hasArguments = (node.arguments && node.arguments.values && node.arguments.values && node.arguments.values.length > 0) || false;
  	console.log("here");
    if (hasArguments) {
      	var error = buildError(node.start.line, node.start.col, 
                                 node.end.line, node.end.col, 
                                 "do not use rangrange", "WARNING", "SECURITY");

      const firstArgumentValue = node.arguments.values[0].value.value;
      const edit = buildEditUpdate(node.start.line, 
                                   node.start.col,
                                   node.end.line, 
                                   node.end.col,
                                   `secrets.randbelow(${firstArgumentValue})`);
      edits.push(edit);
      if(!useSecretsPackage){
        edits.push(buildEditAdd(1, 1, "import secrets\n"));
      }
      const fix = buildFix("use secrets.randbelow instead", edits);
      error = error.addFix(fix);

    	addError(error);
    }
  }
  
  if(importRandRangeFunctionFrom && 
     node.functionName && node.functionName.value === "randrange"){
    const hasArguments = (node.arguments && node.arguments.values && node.arguments.values && node.arguments.values.length > 0) || false;
  	
    var error = buildError(node.start.line, node.start.col, 
                           node.end.line, node.end.col, 
                          "do not use randrange", "WARNING", "SECURITY");

    if(!hasArguments) {
          
     	const edit = buildEditUpdate(node.start.line, node.start.col,
                                   node.end.line, node.end.col,
                                   "secrets.randbelow(100) / 100");
      edits.push(edit);
      if(!useSecretsPackage){
        edits.push(buildEditAdd(1, 1, "import secrets\n"));
      }
      const fix = buildFix("use secrets.randbelow instead", edits);
      error = error.addFix(fix);
    }
    
    const editAddImport = buildEditAdd(1, 1, "import sys\n");
   	addError(error);
  }
  
}