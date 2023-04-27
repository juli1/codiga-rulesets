/**
 * handles all the logic when Codiga hits an assignment in file's AST
 */
function visit(node, filename, code) {
  if (!node.tag) return;
  if (!node.attributes) return;
  if (!node.attributes.length === 0) return;
  // if the tag does't start with a capital, skip it
  if (node.tag.value[0].toUpperCase() !== node.tag.value[0]) return;

  node.attributes.forEach((attribute) => {
    if (attribute?.name?.value === "children") {
      const error = buildError(
        attribute.name.start.line,
        attribute.name.start.col,
        attribute.name.end.line,
        attribute.name.end.col,
        "Children should always be actual children, not passed in as a prop.",
        "WARNING",
        "BEST_PRACTICES"
      );
      addError(error);
    }
  });
}
