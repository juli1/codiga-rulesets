function visit(node) {
  if(node.functionName.value === "eval" && !node.moduleOrObject){
    const hasOneArgument = node.arguments && node.arguments.values && node.arguments.values.length === 1;

    const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, "do not use eval as this is unsafe", "CRITICAL", "SAFETY");

    const argumentValue = node.arguments.values[0].value.str;
    const newFunctionCall = `literal_eval(${argumentValue})`;
    const editReplaceFunctionCall = buildEditUpdate(node.start.line, node.start.col, node.end.line, node.end.col, newFunctionCall)

    const editAddImport = buildEditAdd(1, 1, "from ast import literal_eval\n");


    const fix = buildFix("replace with literal_eval", [editReplaceFunctionCall, editAddImport]);
    addError(error.addFix(fix));
  }
}