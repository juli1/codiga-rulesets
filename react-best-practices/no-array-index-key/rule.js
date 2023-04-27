function visit(node) {
  if (!node || !node.attributes || node.attributes === 0) return;

  // check if the node has a "key" attribute
  const keyAttribute = node.attributes.find((a) => a.name?.value === "key");
  if (!keyAttribute) return;

  // check the value passed in the attribute
  const keyAttributeValue = keyAttribute?.value?.elements[0].value;
  if (!keyAttributeValue) return;

  const currentFunctionCall = node.context.currentFunctionCall;
  if (!currentFunctionCall) return;

  // check if we're in a map function
  if (!currentFunctionCall.functionName?.name?.value === "map") return;

  // check that we get the arguments of the map function
  if (currentFunctionCall?.arguments?.values?.length !== 1) return;

  const arg = currentFunctionCall.arguments.values[0].value;
  if (arg.astType !== "functionexpression") return;

  // check if the function is using the second parameter - index
  if (arg.parameters?.values.length < 2) return;

  const indexName = arg.parameters.values[1].name.value;

  // if the second argument of map is the same value as the key property, raise an issue
  if (indexName === keyAttributeValue) {
    const error = buildError(
      keyAttribute.start.line,
      keyAttribute.start.col,
      keyAttribute.end.line,
      keyAttribute.end.col,
      "Don't use the array index as key",
      "WARNING",
      "BEST_PRACTICE"
    );
    addError(error);
  }
}