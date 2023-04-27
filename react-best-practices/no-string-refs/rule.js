function getStringValue(value) {
  return value?.replace(/^\"/g, "").replace(/\"$/g, "") || ""
}

function getPropStringValue(value) {
  if (value.elements) {
    return getStringValue(value?.elements[0]?.value)
  } else {
    return getStringValue(value?.value)
  }
}

function visit(node, filename, code) {
  if (!node || !node.tag) return;

  // if there's no attributes, skip it
  if (node.attributes.length === 0) return;

  // find the ref prop
  const refProp = node.attributes.find(attribute => attribute.name?.value === 'ref')
  if (!refProp) return

  const refPropString = getPropStringValue(refProp.value)

  if (refProp.value?.astType === "string" && refPropString) {
    const error = buildError(
      refProp.name.start.line,
      refProp.name.start.col,
      refProp.name.end.line,
      refProp.name.end.col,
      `Using string literals in ref attributes is deprecated`,
      "WARNING",
      "BEST_PRACTICE"
    )
    addError(error)
    return;
  }

  if (refProp.value?.astType === "sequence" && ["`", "\"", "'"].includes(refPropString[0])) {
    const error = buildError(
      refProp.name.start.line,
      refProp.name.start.col,
      refProp.name.end.line,
      refProp.name.end.col,
      `Using string literals in ref attributes is deprecated`,
      "WARNING",
      "BEST_PRACTICE"
    )
    addError(error)
  }
}