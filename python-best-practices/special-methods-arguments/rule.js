const METHODS_PARAMETERS = {
  "__add__": 2,
  "__sub__": 2,
  "__mul__": 2,
  "__truediv__": 2,
  "__repr__": 1,
  "__str__": 1,
  "__pow__": 2,
  "__getitem__": 2,
  "__setitem__": 3,
  "__contains__": 2,
  "__iter__": 1,
  "__next__": 1
};

const checkElement = (e) => {
  if (e.astType === "functiondefinition") {
    const functionName = e.name.value;
    if (!METHODS_PARAMETERS[functionName]) {
      return;
    }
    const requiredParameters = METHODS_PARAMETERS[functionName];
    if (e.parameters.values.length != requiredParameters) {
      const error = buildError(e.parameters.start.line, e.parameters.start.col,
        e.parameters.end.line, e.parameters.end.col,
        `${functionName} should only have ${requiredParameters} parameters`, "INFO", "BEST_PRACTICE");
      addError(error);
    }
  }
};

function visit(node, filename, code) {


  if (node.content.astType === "sequence") {
    node.content.elements.forEach(e => checkElement(e));
  }

}