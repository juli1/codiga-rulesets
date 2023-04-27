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

  const flagHook = (element, message) => {
    const error = buildError(element.start.line, element.start.col,
      element.end.line, element.end.col,
      message, "WARNING", "BEST_PRACTICE");
    addError(error);
  }


  // is there a hook usage from this node?
  const containsHook = (element) => {
    if (!element) {
      return false;
    }
    if (element.astType === "functioncall") {
      const name = element.functionName.value;
      return (REACT_HOOKS_NAMES.includes(name));
    }
		if (element.astType === "sequence") {
      return element.elements.map((e) => containsHook(e)).includes(true);
    }
		if (element.astType === "variabledeclaration") {
			return containsHook(element.value);
		}
    return false;
  }

  // indicate if we have a return statement from a given node
  const containsReturnStatement = (element) => {
    if (!element) {
      return false;
    }

    if (element.astType === "return") {
      return true;
    }
    if (element.astType === "sequence") {
      return element.elements.map((e) => {
        return containsReturnStatement(e);
      }).includes(true);
    }
    return false;
  };


  // do we have a if statement with a return inside
  const containsIfWithReturn = (element) => {
		
    if (!element || element === null) {
      return false;
    }
    if (element.astType === "sequence") {
      element.elements.forEach((e) => {
        if (containsIfWithReturn(e)) {
          return true;
        }
      });
    }
    if (element.astType === "ifstatement") {

      return containsReturnStatement(element.statements) || containsReturnStatement(element.elseStatements);
    }
    return false;
  }


  const checkHookUsageInsideFunctionDefinition = (element) => {

    // check if a function content ever calls a hook
    const checkFunctionContent = (element) => {
      if (element.astType === "functionexpression") {
        checkFunctionContent(element.content);
      }
      if (element.astType === "sequence") {
        element.elements.forEach((e) => checkFunctionContent(e));
      }

      if (element.astType === "functioncall") {
        if (element.arguments && element.arguments.values) {
          element.arguments.values.forEach((v) => {
            checkFunctionContent(v.value);
          });
        }
      }

      if (containsHook(element)) {
        flagHook(element, "hook should not be called inside inner functions");
      }

    };


    if (!element) {
      return;
    }
    if (element.astType === "variabledeclaration") {
      checkHookUsageInsideFunctionDefinition(element.value);
    }

    if (element.astType === "functionexpression") {
      checkFunctionContent(element);
    }
  };



  // main entry point
  if (node.right.astType === "functionexpression") {

    const functionContent = node.right.content;
    var hasIfWithReturn = false;
    if (functionContent.astType === "sequence") {
      /**
       * Check for potential use of a hook inside a function there
       */
      functionContent.elements.forEach(e => {
        checkHookUsageInsideFunctionDefinition(e);
      })
      /**
       * Check for each element if we found a if with a return inside.
       * If there is a if with a return, any subsequent hook will have an error
       */
      functionContent.elements.forEach(e => {

        const isHook = containsHook(e);
        if (!hasIfWithReturn) {
          const t = containsIfWithReturn(e);
          if (t) {
            hasIfWithReturn = true;
          }
        }
        if (isHook && hasIfWithReturn) {
          flagHook(e, "hook should not be placed after a if that returns");
        }
      });
    }
  }
}