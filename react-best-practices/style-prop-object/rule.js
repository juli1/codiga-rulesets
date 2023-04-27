function visit(node, filename, code) {
  if (!node) return;

  // if there are no attributes, skip it
  if (node.attributes.length === 0) return;

  // get the style prop object
  const styleProp = node.attributes.find(attribute => attribute.name?.value === 'style')

  // if the prop is a string, build an error
  if (!styleProp.value?.elements) {
    const error = buildError(
      styleProp.name.start.line,
      styleProp.name.start.col,
      styleProp.name.end.line,
      styleProp.name.end.col,
      `Style prop value must be an object`,
      "WARNING",
      "BEST_PRACTICE"
    )
    addError(error)
  } else {
    // if the style prop is an object, skip it
    if (styleProp.value?.elements[0]?.astType === "object") return;

    // if the element isn't an object, build an error
    // TODO
  }
}