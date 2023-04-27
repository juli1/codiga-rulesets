const hasPotentialInjection = (query) => {
  const formatRegExp = /\{[a-zA-Z0-9]*\}/i;
  if (query.match(formatRegExp)) {
    return true;
  }
  return false;
};

const isSqlQuery = (randomString) => {
  const selectRegexp = /.*\s*SELECT\s+[a-zA-Z0-9,*\.\_\-]+\s+FROM\s+[a-zA-Z0-9,*\.\_]/i;
  if (randomString.match(selectRegexp)) {
    return true;
  }
  const updateRegexp = /.*\s*UPDATE\s+[a-zA-Z0-9\_\-]+\s+SET/i;
  if (randomString.match(updateRegexp)) {
    return true;
  }
  const deleteRegexp = /.*\s*DELETE\s+FROM\s+[a-zA-Z0-9,*\.\_\-]+/i;
  if (randomString.match(deleteRegexp)) {
    return true;
  }
  return false;
};

function visit(node, filename, code) {
  
  if (filename.includes("_test.py") || filename.startsWith("test_")) {
  	return;
	}
  
  if(!node.right) {
    return;
  }

  
  if(node.right.astType === "string") {
    const nodeString = node.right;
    const strValue = nodeString.value.toLowerCase();
    if(!strValue.includes("select") &&
       !strValue.includes("update") &&
       !strValue.includes("delete")) {
      return;
    }
    if(isSqlQuery(nodeString.value) && hasPotentialInjection(nodeString.value)){
      const error = buildError(nodeString.start.line, nodeString.start.col, 
                               nodeString.end.line, nodeString.end.col, 
                               "potential SQL injection", "WARNING", "SECURITY");
      addError(error);

    }
  }
  
  if(node.right.astType === "functioncall") {
    const functionCall = node.right;
    if (!functionCall.moduleOrObject) {
      return;
    }
    if(functionCall.functionName.value === "format") {
      if(isSqlQuery(functionCall.moduleOrObject.value) && hasPotentialInjection(functionCall.moduleOrObject.value)){
        	const error = buildError(functionCall.moduleOrObject.start.line, functionCall.moduleOrObject.start.col, 
                  								 functionCall.moduleOrObject.end.line, functionCall.moduleOrObject.end.col, 
                   								 "potential SQL injection", "WARNING", "SECURITY");
          addError(error);

      }
    }
  }
}