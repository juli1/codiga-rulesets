function visit(node, filename, code) {
  const REACT_HOOKS_NAMES = [
    "useState",
    "useEffect",
    "useContext",
    "useReducer",
    "useCallback",
    "useRef",
    "useMemo"
  ]

  const flagHook = (element, hookName) => {
    const error = buildError(element.start.line, element.start.col,
      element.end.line, element.end.col,
      `do not use hook ${hookName} in condition`, "WARNING", "BEST_PRACTICE");
    addError(error);
  }

  const checkUseHooks = (element) => {
    if (!element) {
      return;
    }
    if (element.astType === "sequence") {
      element.elements.forEach(e => checkUseHooks(e));
    }

    if (element.astType === "variabledeclaration") {
      checkUseHooks(element.value);
    }
    if (element.astType === "functioncall") {
      if (element.functionName && element.functionName.value && REACT_HOOKS_NAMES.includes(element.functionName.value)) {
        flagHook(element.functionName, REACT_HOOKS_NAMES.find(v => v === element.functionName.value));
      }
    }
  }

  if (node.statements) {
    checkUseHooks(node.statements);
  }
  if (node.elseStatements) {
    checkUseHooks(node.statements);
  }

}