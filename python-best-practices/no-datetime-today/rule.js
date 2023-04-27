function visit(pattern, filename, code) {
  const error = buildError(pattern.start.line, pattern.start.col, pattern.end.line, pattern.end.col, "use datetime.now() instead of datetime.today()", "INFO", "BEST_PRACTICES");
  const edit = buildEdit(pattern.start.line, pattern.start.col, pattern.end.line, pattern.end.col, "update", "datetime.now()");
  const fix = buildFix("use datetime.now()", [edit]);
  addError(error.addFix(fix));
}