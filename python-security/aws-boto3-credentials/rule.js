function visit(node) {
  if (!node.arguments || !node.arguments.values || !node.context) {
    return;
  }
  const functions = ["Session", "client"];

  if (!node.functionName || !functions.includes(node.functionName.value)){
    return;
  }
  
  const arguments = node.arguments.values;
  const nbArguments = node.arguments.values.length;
  const allPackages = node.context.imports.filter(i => i.packages).flatMap(i => i.packages.map(p => p.name.str));
  const useBotoPackage = allPackages.filter(i => i === "boto3").length > 0;
  
  if (!useBotoPackage){
    return;
  }
  
  const ACCESS_KEY_PREFIX = [
    "ABIA", "ACCA", "AGPA", "AIDA", "AIPA", "AKIA", "ANPA", "ANVA",
    "APKA", "AROA", "ASCA", "ASIA"];
  const accessKeyArguments = node.arguments.values.filter(a => a.name && a.name.value == "aws_access_key_id");
  const secretKeyArguments = node.arguments.values.filter(a => a.name && a.name.value == "aws_secret_access_key");
  
  functions.forEach(functionName => {
    const hasAccessKeyArgument = accessKeyArguments.length > 0;
    const hasSecretKeyArgument = secretKeyArguments.length > 0;
    
    if((hasAccessKeyArgument ||hasSecretKeyArgument)  && node.functionName.value === functionName && node.moduleOrObject.value === "boto3"){
      const accessKey = accessKeyArguments[0].value.value;
      const secretKey = secretKeyArguments[0].value.value;
      
      // remove potential quote
      const accessKeyPrefix = accessKey.replace(/['"]+/g, '').substring(0, 4);
      console.log(accessKeyPrefix);
      
      if (ACCESS_KEY_PREFIX.includes(accessKeyPrefix)) {
        const error = buildError(node.start.line, node.start.col, node.end.line, node.end.col, "Clear credentials passed, use environment variables", "CRITICAL", "SECURITY");
        const lineToInsert = arguments[arguments.length - 1].end.line;
        const colToInsert = arguments[arguments.length - 1].end.col;
        addError(error);
      }
     
  	}
  });
  
}