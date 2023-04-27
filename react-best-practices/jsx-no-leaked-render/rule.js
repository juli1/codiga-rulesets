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

  return value.value.replace(/^\"/g, "").replace(/\"$/g, "");
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

function propHasValue(attribute) {
  const value = getPropValue(attribute);

  if (typeof value !== "boolean") {
    return !!value;
  }

  return false;
}

function visit(node, filename, code) {
  if (!node) return
  return;
  // console.log(JSON.stringify(node))
  // console.log(printObject(node))
  // your code here
}