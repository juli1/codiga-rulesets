/**
 * what are the different types that a button can have
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type
 */
const BUTTON_TYPES = ["submit", "reset", "button"];

/**
 * checks if there is a valid type attribute on the targeted element
 */
function checkForValidTypeAttribute(attributes) {
  let isValidTypeAttributePresent = false;

  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i];
    const attributeName = attribute?.name?.value;
    const attributeValue = attribute?.value?.value;
    if (attributeName && attributeName === "type" && attributeValue) {
      const value = attributeValue.replace(/['"]+/g, "");
      if (BUTTON_TYPES.includes(value)) {
        isValidTypeAttributePresent = true;
        break;
      }
    }
  }

  return isValidTypeAttributePresent;
}

/**
 * handles all the logic when Codiga hits an assignment in file's AST
 */
function visit(node, filename, code) {
  if (!node.tag) return;
  if (node.tag.value !== "button") return;
  if (!node.attributes) return;

  /**
   * if there are no attributes, give the user the option to create one
   */
  if (!checkForValidTypeAttribute(node.attributes)) {
    const error = buildError(
      node.tag.start.line,
      node.tag.start.col,
      node.tag.end.line,
      node.tag.end.col,
      "Missing a valid type attribute",
      "WARNING",
      "ERROR_PRONE"
    );

    const edits = BUTTON_TYPES.map((type) => [
      buildEditAdd(node.tag.end.line, node.tag.end.col, ` type="${type}"`),
    ]);

    const fixes = BUTTON_TYPES.map((type, i) =>
      buildFix(`add type="${type}"`, edits[i])
    );

    // we have three possible values to implement
    addError(error.addFix(fixes[0]).addFix(fixes[1]).addFix(fixes[2]));
  }
}
