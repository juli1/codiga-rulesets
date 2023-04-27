function checkIfFragment(tag) {
  if (tag === null) return true;
  if (tag.value === "Fragment") return true;
  if (tag.value === "React.Fragment") return true;
  return false;
}

function visit(node, filename, code) {
  if (!node) return;
	return

  // we won't check tags that aren't fragments
  const isFragment = checkIfFragment(node.tag);

  // check if a fragment is the only thing in an html element
  // if (node.tag?.value[0] === node.tag?.value[0].toLowerCase()) {
  //     node.htmlChildren.forEach(child => {
  //       if (child.tag === null) {
  //         const error = buildError(
  //           child.start.line,
  //           child.start.col,
  //           child.end.line,
  //           child.end.col,
  //           `useless React Fragment`,
  //           "INFORMATIONAL",
  //           "BEST_PRACTICE"
  //         );

  //         addError(error);
  //         return
  //       }
  //     })
  //   }

  // if it's not a fragment exit
  if (!isFragment) return;

  // if it's a fragment but has a key prop, skip it
  if (node.tag && node.attributes.some(attribute => attribute.name.value === "key")) return;

  // if there's more than one child, then the fragment is needed
  if (node.content.length > 1) return;

  const error = buildError(
    node.start.line,
    node.start.col,
    node.end.line,
    node.end.col,
    `useless React Fragment`,
    "INFORMATIONAL",
    "BEST_PRACTICE"
  );

  addError(error);
}