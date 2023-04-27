function checkProtocol(node, protocol) {
  if (!node.arguments || !node.context){
    return;
  }
  if (!(node.functionName.value === "wrap_socket" && node.moduleOrObject.value === "ssl")) {
    return;
  }

  const useOutdatedProtocol = node.arguments.values.filter(a => a.value && a.value.str == `ssl.${protocol}`).length > 0;

  const allPackages = node.context.imports.filter(i => i.packages).flatMap(i => i.packages.map(p => p.name.str));
  const useSslPackage = allPackages.filter(i => i === "ssl").length > 0;

  if(useOutdatedProtocol && useSslPackage){
    const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, `Use of insecure protocol ${protocol}`, "CRITICAL", "SECURITY");
    addError(error);
  } 
}

function visit(node) {
  if (!node.arguments){
    return;
  }
  if (!(node.functionName.value === "wrap_socket" && node.moduleOrObject.value === "ssl")) {
    return;
  }
  const protocols = ["PROTOCOL_SSLv3", "PROTOCOL_SSLv2", "SSLv2_METHOD", "SSLv23_METHOD", "PROTOCOL_TLSv1", "SSLv3_METHOD", "TLSv1_METHOD"];
  protocols.forEach(protocol => {
    checkProtocol(node, protocol);
  });

}