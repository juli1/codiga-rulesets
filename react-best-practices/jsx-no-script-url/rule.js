const LINK_PROPS = ['href', 'to']

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

  if (node.attributes.length === 0) return;

  const linkProp = node.attributes.find(attribute => LINK_PROPS.includes(attribute.name?.value))

  if (getPropStringValue(linkProp.value).replace(/\"$/g, "").startsWith("javascript:")) {
    const error = buildError(
      linkProp.start.line,
      linkProp.start.col,
      linkProp.end.line,
      linkProp.end.col,
      `Disallow usage of "javascript:" URLs`,
      "WARNING",
      "BEST_PRACTICE"
    )
    addError(error)
  }
}