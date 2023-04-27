function visit(node) {
  if (!node || !node.attributes || node.attributes.length === 0) return;

  const dangerouslySetInnerHTMLAttribute = node.attributes.find(
    (a) => a.name?.value === "dangerouslySetInnerHTML"
  );

  if (!dangerouslySetInnerHTMLAttribute) return;

  const numOfChildren = node.htmlChildren?.length;

  if (!numOfChildren) return;

  const error = buildError(
    node.tag.start.line,
    node.tag.start.col,
    node.tag.end.line,
    node.tag.end.col,
    "Only set one of `children` or `props.dangerouslySetInnerHTML`",
    "WARNING",
    "BEST_PRACTICE"
  );

  addError(error);
}