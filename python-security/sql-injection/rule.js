function visit(node) {
  // no arguments
  if (!node.arguments || !node.context || !node.arguments.values || node.arguments.values.length == 0) {
    return;
  }

  const arguments = node.arguments.values;
  const nbArguments = node.arguments.values.length;

  // no function or module name
  if (!node.functionName) {
    return;
  }


  // common names given for cursor to execute SQL
  const objects = ["cursor", "cur"];
  const argumentValueString = node.arguments.values[0].value.value;
	const argumentValue = node.arguments.values[0].value;

  const useFstring = argumentValueString && argumentValueString.startsWith("f");
  const useFormatString = argumentValueString && argumentValueString.includes(".format(");
	const useFormatFunction = argumentValue && argumentValue.astType === "functioncall" && argumentValue.functionName.value === "format";
  const hasError = useFstring || useFormatString || useFormatFunction;


  var errorMessage = "Do not use f-string in SQL queries, it leads to SQL injections";

  if (useFormatString) {
    errorMessage = "Do not use format string in SQL queries, it leads to SQL injections";
  }

  if (node.moduleOrObject && objects.includes(node.moduleOrObject.value)) {
    // check that we do not have cursor.execute() or cur.execute() with a potential buggy SQL query
    objects.forEach(o => {
      if (hasError && node.functionName.value === "execute" && node.moduleOrObject && node.moduleOrObject.value === o) {

        const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, errorMessage, "CRITICAL", "SAFETY");
        addError(error);
      }
    });
  }


  if (node.functionName && node.functionName.value === "text") {
    // check for SQL Alchemy
    const importTextFromSqlAlchemy = node.context.imports
      .filter(r => r.pkg && r.pkg.value === "sqlalchemy" && r.elements &&
        r.elements.filter(e => e.name).map(e => e.name.value).includes("text")).length > 0;

    if (hasError && importTextFromSqlAlchemy && node.functionName.value === "text") {
      const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, errorMessage, "CRITICAL", "SAFETY");
      addError(error);
    }
  }
}