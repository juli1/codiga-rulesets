function visit(pattern, filename, code) {
  const exceptionName = pattern.variables.get("exceptionName");
  if (exceptionName && exceptionName.value === "NotImplemented") {
    const error = buildError(pattern.start.line, pattern.start.col, pattern.end.line, pattern.end.col, "raise NotImplemented is not a valid error", "INFO", "BEST_PRACTICES");
    const edit = buildEdit(pattern.start.line, pattern.start.col, pattern.end.line, pattern.end.col, "update", "raise NotImplementedError");
    const fix = buildFix("raise NotImplementedError", [edit]);
    addError(error.addFix(fix));
  }
}