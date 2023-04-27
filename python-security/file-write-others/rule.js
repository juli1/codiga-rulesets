function visit(pattern, filename, code) {
  const mode = pattern.variables.get("mode");
  
  if(filename.includes("_test.py") || filename.startsWith("test_")) {
    return;
  }

  console.log(mode.value);
  if (mode.value.includes("stat.S_IWOTH")) {
    const error = buildError(mode.start.line, mode.start.col, mode.end.line, mode.end.col, "file can be written by others", "CRITICAL", "security");
    const filename = pattern.variables.get("file").value;
    const modes = mode.value.replaceAll(" ", "").split("|").filter(e => e !== "stat.S_IWOTH");
    const newModes = modes.join(" | ");
    const edit = buildEdit(mode.start.line, mode.start.col, mode.end.line, mode.end.col, "update", newModes);
    const fix = buildFix("remove the write flag", [edit]);
    addError(error.addFix(fix));
  }

}