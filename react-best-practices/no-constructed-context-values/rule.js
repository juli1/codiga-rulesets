function visit(node, filename, code) {
  if (!node || !node.tag || !node.attributes) return;

  // check if there's a value prop
  const valueProp = node.attributes.find(a => a.name?.value === "value")
  if (!valueProp) return;

  // check if there's a `.Provider` in the element name
  if (!node.tag.value?.includes(".Provider")) return;

  // check if the value prop is reference or not
  if (!valueProp.value?.elements[0]?.elements) return;

  const error = buildError(
    valueProp.start.line,
    valueProp.start.col,
    valueProp.end.line,
    valueProp.end.col,
    `This context value prop changes every render. Consider wrapping the value in a useMemo/useCallback hook.`,
    "WARNING",
    "BEST_PRACTICE"
  )

  addError(error)
}