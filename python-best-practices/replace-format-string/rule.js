function visit(node, filename, code) {
  if (node.functionName.value !== "format") {
    return;
  }
  if (!node.moduleOrObject || !node.moduleOrObject.value || !node.arguments || !node.arguments.values) {
    return;
  }
  var newText = node.moduleOrObject.value;
  const arguments = node.arguments.values.map(a => {
    return a.value.str;
  });

  for (var i = 0; i < arguments.length; i = i + 1) {
    const v = arguments[i];
    const isString = v && v.startsWith('"') && v.length > 2 && v.endsWith('"');

    if (isString) {
      // remove the quotes
      const s = v.substring(1, v.length - 1);
      newText = newText.replaceAll(`{${i}}`, s);
    } else {
      newText = newText.replaceAll(`{${i}}`, `{${arguments[i]}}`);
    }

  }

  const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, "Format string are old format", "INFO", "BEST_PRACTICES");

  addError(error);

}