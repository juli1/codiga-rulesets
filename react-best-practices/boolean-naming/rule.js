/**
 * what's the minimum length of variable names that this should run on
 */
const MINIMUM_LENGTH = 4;

/**
 * what a boolean assignment should start with
 */
const BOOLEAN_ASSIGNMENT_STARTERS = ["is", "has", "can"];

/**
 * check whether the left-side of the assignment
 * has a boolean type naming
 */
function checkLeftSideBooleanNaming(value) {
  let isBooleanNaming = false;
  for (const booleanAssignmentStarter of BOOLEAN_ASSIGNMENT_STARTERS) {
    if (value.startsWith(booleanAssignmentStarter)) {
      isBooleanNaming = true;
      break;
    }
  }
  return isBooleanNaming;
}

/**
 * check whether the right-side of the assignment is a boolean
 */
function checkRightSideForBoolean(value) {
  if (value === "true" || value === "false") {
    return true;
  } else {
    return false;
  }
}

/**
 * check whether the right-side of the assignment is a functioncall
 */
function checkRightSideForFunction(astType) {
  if (astType === "functionexpression") {
    return true;
  } else {
    return false;
  }
}

/**
 * concatenates the starter and value (pascalCase)
 */
function editValue(value, starter) {
  return `${starter}${value.charAt(0).toUpperCase() + value.substring(1)}`;
}

/**
 * handles all the logic when Codiga hits an assignment in file's AST
 */
function visit(node, filename, code) {
  if (!node || !node.left || !node.right || !node.left.value) return;

  const isLeftSideBooleanNaming = checkLeftSideBooleanNaming(node.left.value);
  const isRightSideABoolean = checkRightSideForBoolean(node.right.value);
  const isRightSideAFunction = checkRightSideForFunction(node.right.astType);

  if (node.left.value.length < MINIMUM_LENGTH) return;

  /**
   * if the assignment has boolean type naming and the value
   * isn't a boolean show a warning that it's not standard
   */
  // if (
  //   isLeftSideBooleanNaming &&
  //   !isRightSideABoolean &&
  //   !isRightSideAFunction
  // ) {
  //   const error = buildError(
  //     node.left.start.line,
  //     node.left.start.col,
  //     node.left.end.line,
  //     node.left.end.col,
  //     "Your naming indicates this variable is a boolean.",
  //     "WARNING",
  //     "BEST_PRACTICES"
  //   );
  //   addError(error);
  // }

  /**
   * if the assignment doesn't have boolean type naming, but the
   * value is a boolean, suggest fixes for the assignment.
   */
  if (!isLeftSideBooleanNaming && isRightSideABoolean) {
    const error = buildError(
      node.left.start.line,
      node.left.start.col,
      node.left.end.line,
      node.left.end.col,
      "Your variable naming should indicate it's a boolean.",
      "WARNING",
      "BEST_PRACTICES"
    );

    const oldValue = node.left.value;

    const edits = BOOLEAN_ASSIGNMENT_STARTERS.map((starter) => {
      const newValue = editValue(oldValue, starter);
      return [
        buildEditUpdate(
          node.left.start.line,
          node.left.start.col,
          node.left.end.line,
          node.left.end.col,
          editValue(oldValue, starter)
        ),
      ];
    });

    const isFix = buildFix(`naming with: is`, edits[0]);
    const hasFix = buildFix(`naming with: has`, edits[1]);
    const canFix = buildFix(`naming with: can`, edits[2]);

    addError(error.addFix(isFix).addFix(hasFix).addFix(canFix));
  }
}