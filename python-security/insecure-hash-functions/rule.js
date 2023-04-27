function checkAlgorithm(node, hashMethod) {
  if (!(node.functionName.value === "new" && node.moduleOrObject.value === "hashlib")) {
    return;
  }
  if (!node.arguments || !node.arguments.values || !node.context){
    return;
  }

  const useOutdatedHashMethod = node.arguments.values
  	.filter(a => a.value && a.value.str.toLowerCase() == `'${hashMethod}'`).length > 0;

  const allPackages = node.context.imports
  	.filter(i => i.packages)
  	.flatMap(i => i.packages.map(p => p.name.str));
  const useHashlib = allPackages.filter(i => i === "hashlib").length > 0;

  if(useOutdatedHashMethod && useHashlib){
    const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, `Use of insecure hashing method ${hashMethod}`, "CRITICAL", "SECURITY");
    addError(error);
  } 
}

const checkHashlib = (node) => {
  const methods = ["md4", "md5", "sha1"];
  methods.forEach(method => {
    checkAlgorithm(node, method);
  });
}

const checkCryptography = (node) => {
  if(node.moduleOrObject && node.moduleOrObject.value === "hashes" && node.functionName && node.functionName.value === "MD5") {
		const useHashes = node.context.imports.filter(i => i.pkg && i.pkg.value === "cryptography.hazmat.primitives" && i.elements && i.elements.map(e => e.name.value).includes("hashes")).length > 0;
    if (useHashes) {
      const error = buildError(node.functionName.start.line, node.functionName.start.col, 
                               node.functionName.end.line, node.functionName.end.col, 
                               "MD5 is not secure", "ERROR", "SECURITY");
      const edit = buildEditUpdate(node.functionName.start.line, node.functionName.start.col, node.functionName.end.line, node.functionName.end.col, "SHA3_256")
      const fix = buildFix("use SHA3_256 instead", [edit]);
      addError(error.addFix(fix));
    }
  }
};


function visit(node, filename) {
  checkHashlib(node);
  checkCryptography(node);
}