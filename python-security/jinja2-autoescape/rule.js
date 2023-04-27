function visit(node, filename, code) {
  
  if(!node.functionName || !node.context) {
    return;
  }
  
  if (node.functionName.value === "Environment") {
    
    const useJinja2Environment = node.context.imports.filter(i => i.elements && i.pkg).filter(i => i.elements.map(e => e.name.value).includes("Environment") && i.pkg.value === "jinja2").length > 0;
	
    if(useJinja2Environment) {
      if(!node.arguments || !node.arguments.values){
        return;
      }
      
      const hasAutoEscape = node.arguments.values.filter(a => a.name && a.name.value == "autoescape").length > 0;
			
      if(hasAutoEscape){
      	const arg = node.arguments.values.filter(a => a.name && a.name.value == "autoescape")[0];
        if(arg.value.value === "False"){
             const error = buildError(arg.start.line, arg.start.col, arg.end.line, arg.end.col, "autoescape=False leads to XSS issues", "CRITICAL", "SECURITY");

             const edit = buildEditUpdate(
               arg.value.start.line, arg.value.start.col,
               arg.value.end.line, arg.value.end.col, "True")
    				const fix = buildFix("use autoescape True", [edit]);
    				addError(error.addFix(fix));
        }
      }
    }
  }
  
}