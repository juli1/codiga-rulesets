const BLANK = "_blank";
const NO_OPENER = "noopener";
const NO_REFERRER = "noreferrer";
const VALID_RELS = [NO_OPENER, NO_REFERRER, `${NO_OPENER} ${NO_REFERRER}`];

/**
 * checks if the href value is an external link
 */
function checkIfExternalLink(href) {
  if (href.startsWith("http")) {
    return true;
  } else {
    return false;
  }
}

function checkIfValidRel(rel) {
  if (rel.includes(NO_REFERRER) || rel.includes(NO_OPENER)) {
    return true;
  } else {
    return false;
  }
}

/**
 * handles all the logic when Codiga hits an assignment in file's AST
 */
function visit(node, filename, code) {
  if (!node.tag) return;
  if (node.tag.value !== "a") return;
  if (!node.attributes) return;

  const targetProp = getProp(node.attributes, "target");
  if (!targetProp) return;

  const targetPropValue = getPropValue(targetProp);
  if (targetPropValue !== BLANK) return;

  const hrefProp = getProp(node.attributes, "href");
  const hrefPropValue = getPropValue(hrefProp);
  const isExternalLink = checkIfExternalLink(hrefPropValue);
  if (!isExternalLink) return;

  const relProp = getProp(node.attributes, "rel");
  const relPropValue = getPropValue(relProp);
  if (relProp) {
    const isValidRel = checkIfValidRel(relPropValue);
    if (isValidRel) return;

    /**
     * build an error that fixes the rel='' attributes
     */
    const fixRelError = buildError(
      relProp.start.line,
      relProp.start.col,
      relProp.end.line,
      relProp.end.col,
      `When using target="blank", your rel should include either noopener or noferrer`,
      "WARNING",
      "SECURITY"
    );

    const edits = VALID_RELS.map((rel) => [
      buildEditUpdate(
        relProp.start.line,
        relProp.start.col,
        relProp.end.line,
        relProp.end.col,
        `rel="${rel}"`
      ),
    ]);

    const openerFix = buildFix(`use rel="${VALID_RELS[0]}"`, edits[0]);
    const referrerFix = buildFix(`use rel="${VALID_RELS[1]}"`, edits[1]);
    const bothFix = buildFix(`use rel="${VALID_RELS[2]}"`, edits[2]);

    addError(fixRelError.addFix(openerFix).addFix(referrerFix).addFix(bothFix));
  } else {
    /**
     * build an error that adds a rel='' attributes
     */
    const noRelError = buildError(
      node.tag.start.line,
      node.tag.start.col,
      node.tag.end.line,
      node.tag.end.col,
      `When using target="blank", your rel should include either noopener or noferrer`,
      "WARNING",
      "SECURITY"
    );

    const edits = VALID_RELS.map((rel) => [
      buildEditAdd(node.tag.end.line, node.tag.end.col, `rel="${rel}"`),
    ]);

    const noOpenerFix = buildFix(`use rel="${VALID_RELS[0]}"`, edits[0]);
    const noReferrerFix = buildFix(`use rel="${VALID_RELS[1]}"`, edits[1]);
    const bothFix = buildFix(`use rel="${VALID_RELS[2]}"`, edits[2]);

    addError(
      noRelError.addFix(noOpenerFix).addFix(noReferrerFix).addFix(bothFix)
    );
  }
}

/**
 * UTILITIES USED TO EXTRACT DATA
 */
const TYPES = {
  string: getPropStringValue,
  sequence: getPropSequenceValue,
  array: getPropArrayValue,
  object: getPropObjectValue,
  object_element: getPropObjectValue,
  functiondefinition: () => {},
};

function getTag(node) {
  if (node && node.tag) {
    return node.tag.value;
  }
}

function getProp(attributes = [], prop = "") {
  if (!prop) return;

  return attributes.find((attribute) => {
    if (attribute && attribute.name && attribute.name.value) {
      return attribute.name.value === prop;
    }
  });
}

function getPropStringValue(value) {
  if (value.value === "true") {
    return true;
  }

  if (value.value === "false") {
    return false;
  }

  return value.value.replace(/^[\"\']/g, "").replace(/[\"\']$/g, "");
}

function getPropArrayValue(value) {
  const array = [];
  const arrayElements = value.elements;

  if (arrayElements.length) {
    for (const element of arrayElements) {
      array.push(TYPES[element.astType](element));
    }
  }

  return array;
}

function getPropObjectValue(value) {
  const object = {};
  const objectElements = value.elements;

  if (objectElements.length) {
    for (const element of objectElements) {
      object[element.name.value] = TYPES[element.value.astType](element.value);
    }
  }

  return object;
}

function getPropSequenceValue(value) {
  if (value.elements.length) {
    const element = value.elements[0];

    if (element) {
      return TYPES[element.astType](element);
    }
  }
}

function extractValue(attribute, extractor) {
  if (attribute) {
    // Null valued attributes imply truthiness.
    // For example: <div aria-hidden />
    if (attribute.value === null) return true;

    return extractor(attribute.value);
  }
}

function getValue(value) {
  return TYPES[value.astType](value);
}

function getPropValue(attribute) {
  return extractValue(attribute, getValue);
}

function debugObject(object) {
  for (const property in object) {
    console.log(`${property}: ${JSON.stringify(object[property])}`);
  }
}

function propHasValue(attribute) {
  const value = getPropValue(attribute);

  if (typeof value !== "boolean") {
    return !!value;
  }

  return false;
}
