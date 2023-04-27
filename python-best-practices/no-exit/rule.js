function visit(node) {
  if((!node.moduleOrObject || node.moduleOrObject.value !== "sys") && node.functionName.value === "exit"){
    const hasOneArgument = node.arguments.values && node.arguments.values.length === 1;

    const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, "do not use exit()", "CRITICAL", "SAFETY");

    const argumentValue = node.arguments.values[0].value.str;
    const newFunctionCall = `sys.exit(${argumentValue})`;
    const editReplaceFunctionCall = buildEditUpdate(node.start.line, node.start.col, node.end.line, node.end.col, newFunctionCall)

    const editAddImport = buildEditAdd(1, 1, "import sys\n");

    const fix = buildFix("replace with sys.exit()", [editReplaceFunctionCall, editAddImport]);
    addError(error.addFix(fix));
  }
}