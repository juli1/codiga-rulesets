const MODULES_FUNCTIONS_TO_AVOID = {
  "pickle": ["loads", "load", "Unpickler"],
  "shelve": ["open"],
  "marshal": ["load", "loads"],
  "jsonpickled": ["decode"],
  "pandas": ["read_pickle"],
	"marshal": ["load", "loads"]
}


function visit(node, filename, code) {
  if (!node || !node.functionName || !node.moduleOrObject || !node.context) {
    return;
  }

  if (filename.includes("_test.py") || filename.startsWith("test_")) {
    return;
  }

  const module = node.moduleOrObject.value;
  const func = node.functionName.value;

  if (MODULES_FUNCTIONS_TO_AVOID[module]) {
    const allPackages = node.context.imports.filter(r => r.packages).flatMap(i => i.packages.map(p => p.name.str));
    const useModule = allPackages.filter(i => i === module).length > 0;
    if (!useModule) {
      return;
    }

    const functions = MODULES_FUNCTIONS_TO_AVOID[module];

    if (functions.includes(func)) {
      const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, `${module}.${func} is not safe for deserializing unstrusted data`, "CRITICAL", "SECURITY");
      addError(error);
    }
  }
}