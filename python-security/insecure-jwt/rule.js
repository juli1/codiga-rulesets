function visit(node, filename, code) {

  // If the analyzer did not get the arguments or if there is no argument, exit
  if (!node.arguments || !node.arguments.values || node.arguments.values.length === 0) {
    return;
  }

  if (!node.moduleOrObject || node.moduleOrObject.value !== "jwt") {
    return;
  }

  // if the function is not defined or not equal to "info"
  // we can return.
  if (!node.functionName || node.functionName.value !== "decode") {
    return;
  }

  const arguments = node.arguments.values;
  const nbArguments = node.arguments.values.length;

  const allPackages = node.context.imports.filter(r => r.packages).flatMap(i => i.packages.map(p => p.name.str));

  const useJwtPackage = allPackages.filter(i => i === "jwt").length > 0;
  if (!useJwtPackage) {
    return;
  }

  // Do we have an options arguments?
  const optionArguments = arguments.filter(a => a.name && a.name.value === "options");
  if (optionArguments && optionArguments.length > 0) {
    const optionArgument = optionArguments[0];
		if(optionArgument.value && optionArgument.value.astType === "dictionary") {
			const dictionary = optionArgument.value;
			const hasIssue = dictionary.elements
				.filter(e => e.key && e.key.value && e.key.value === "\"verify_signature\"" && e.value && e.value.value && e.value.value === "False").length > 0;
			if (hasIssue) {
				// build the error
				const error = buildError(optionArgument.start.line, optionArgument.start.col,
					optionArgument.end.line, optionArgument.end.col,
					"insecure JWT, change verify_signature to True", "WARNING", "SECURITY");

				addError(error);
    	}
		}
  }
}