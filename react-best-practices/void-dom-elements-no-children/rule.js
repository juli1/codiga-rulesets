const CHILDREN_PROPS = [
  "children",
  "dangerouslySetInnerHTML"
]

const VOID_DOM_ELEMENTS = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  menuitem: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
};


function isVoidDOMElement(elementName) {
  return !!VOID_DOM_ELEMENTS[elementName];
}

const VOID_ELEMENTS = ["br", "hr", "img"]

function visit(node, filename, code) {
  if (!node || !node.tag) return;

  // if this isn't a void element skip it
  if (!isVoidDOMElement(node.tag?.value)) return;

  // does this void element have children
  const hasChildren = node.htmlChildren.length !== 0;

  // does this void element have children passed as a prop
  const hasChildrenProp = node.attributes.some(child => CHILDREN_PROPS.includes(child.name?.value));

  // if there are children of any type, show an error
  if (hasChildren || hasChildrenProp) {
    const error = buildError(
      node.tag.start.line,
      node.tag.start.col,
      node.tag.end.line,
      node.tag.end.col,
      `Disallow void DOM elements (e.g. "<img />", "<br />") from receiving children`,
      "WARNING",
      "BEST_PRACTICE"
    )
    addError(error)
  }
}