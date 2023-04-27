function visit(pattern, filename, code) {
  if(filename.includes("_test.py") || filename.startsWith("test_")) {
    return;
  }

  const error = buildError(pattern.start.line, pattern.start.col, pattern.end.line, pattern.end.col, "No assert in production code", "WARN", "code_style");
  const edit = buildEditRemove(pattern.start.line, pattern.start.col, pattern.end.line, pattern.end.col);
  const fix = buildFix("remove assert", [edit]);
  addError(error.addFix(fix));
}