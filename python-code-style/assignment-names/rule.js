const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const useCamelCase = (string) => /[A-Z]/.test(string);
const twoConsecutiveCapitalLetters = (string) => /[A-Z]{2,}/.test(string);

const checkString = (element) => {

  if(useCamelCase(element.value) && !twoConsecutiveCapitalLetters(element.value)) {
    const snakeCaseValue = camelToSnakeCase(element.value);
    const error = buildError(element.start.line, element.start.col, 
                             element.end.line, element.end.col, 
                             "use snake_case and not camelCase", "MINOR", "BEST_PRACTICES");
    const edit = buildEditUpdate(element.start.line, element.start.col,
                                 element.end.line, element.end.col, snakeCaseValue);
    const fix = buildFix(`${snakeCaseValue} instead of ${element.value}`, [edit]);
    addError(error.addFix(fix));
  }
};

function visit(node, filename, code) {
	if(!node.left) {
    return;
  }
  if(node.left.astType === "string"){
    checkString(node.left);
  }
  if(node.left.astType === "list") {
    if(node.left.elements) {
      node.left.elements.forEach(element => {
        if(element.astType === "string"){
          checkString(element);
        }
      });
    }
  }
}