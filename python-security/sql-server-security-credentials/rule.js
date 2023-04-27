const detectClearCredentials = (node, pythonModuleName, functionName, parameterName) => {
  
  if(!node.moduleOrObject || node.moduleOrObject.value !== pythonModuleName){
    return;
  }
  

  if(!node.functionName || node.functionName.value !== functionName){
    return;
  }
  
  // Get the list of argument
  const arguments = node.arguments.values;
  const nbArguments = node.arguments.values.length;
  // Get all the package list that are imported with "import <name>"
  const allPackages = node.context.imports.filter(r => r.packages).flatMap(i => i.packages.map(p => p.name.str));
  // Do we use the package we are looking for?
  const usePackage = allPackages.filter(i => i === pythonModuleName).length > 0;
  if (!usePackage){
    return;
  }
  
  // Is the first argument value foo?
  const argumentPasswords = node.arguments.values.filter(a => a.name && a.name.value === parameterName);
  
  if(argumentPasswords && argumentPasswords.length > 0){
    const argumentPassword = argumentPasswords[0];
    if (!argumentPassword.value || !argumentPassword.value.value) {
      return;
    }
    const argumentValue = argumentPassword.value.value;
    
    if(argumentValue.startsWith("\"") || argumentValue.startsWith("f\"")) {
       
      // build the error
      const error = buildError(argumentPassword.value.start.line, argumentPassword.value.start.col, 
                               argumentPassword.value.end.line, argumentPassword.value.end.col, 
                               "hardcoded credential", "CRITICAL", "SECURITY");

      // report an error with a fix
      addError(error);
  	}
  }
}


function visit(node, filename, code) {
  
  // If filename starts or ends with test_ or _test, do not do anything
  if(filename.includes("_test.py") || filename.startsWith("test_")) {
    return;
  }
  // If the analyzer did not get the arguments or if there is no argument, exit
  if(!node.arguments || !node.context || !node.arguments.values || node.arguments.values.length  === 0) {
    return;
  }
	detectClearCredentials(node, "mysql.connector", "connect", "passwd");
  detectClearCredentials(node, "psycopg2", "connect", "password");
}
  