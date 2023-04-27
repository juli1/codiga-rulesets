function visit(pattern) {
  const error = buildError(pattern.start.line, pattern.start.col, pattern.end.line, pattern.end.col, "file with read-only defined", "WARN", "bestpractices");
  const filename = pattern.variables.get("file").value;
  const edit = buildEdit(pattern.start.line, pattern.start.col, pattern.end.line, pattern.end.col, "replace", `open(\"${filename}\")`);
  const fix = buildFix("remove the read-only flag", [edit]);

  addError(error.addFix(fix));
}