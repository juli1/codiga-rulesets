function visit(pattern, filename, code) {
	return;
  const error = buildError(
  	pattern.start.line,
    pattern.start.col,
    pattern.end.line,
    pattern.end.col,
    `Instead of spreading props, be more explicit and set your values to improve readability`,
    "INFO",
    "BEST_PRACTICES"
  )
  addError(error)
}