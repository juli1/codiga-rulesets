const myRegex = /\w+Exception/;

function visit(node, filename, code) {
  const isException = myRegex.test(node.name.value);

  if (isException && node.parentClasses.length == 0) {
    const edit = buildEditAdd(node.name.end.line, 
															node.name.end.col,
														 "(Exception)");


    const fix = buildFix("add Exception as parent", [edit]);

    const error = buildError(
      node.name.start.line, node.name.start.col,
      node.name.end.line, node.name.end.col,
      "Exceptions must inherit the Exception class", "INFORMATION", "BEST_PRACTICE");

    addError(error.addFix(fix));
  }
}