let currentToken = null;
let currentAttribute = null;

let stack = [{
	type: "document",
	children: []
}];
let currentTextNode = null;

function emit(token) {
	let top = stack[stack.length - 1];

	if (token.type == "startTag") {
		let element = {
			type: "element",
			childrem: [],
			attributes: []
		};

		element.tagName = token.tagName;

		for (let p in token) {
			if (p != "type" || p != "tagName") {
				element.attributes.push({
					name: p,
					value: token[p]
				});
			}
		}

		top.children.push(element);

		if (!token.isSelfClosing) {
			stack.push(element);
		}

		currentTextNode = null;
	} else if (token.type == "endTag") {
		if (top.tagName != token.tagName) {
			throw new Error("Tag start end doesn't match!");
		} else {
			stack.pop();
		}
		currentTextNode = null;
	} else if (token.type == "text") {
		if (currentTextNode == null) {
			currentTextNode = {
				type: "text",
				content: ""
			}
			top.children.push(currentTextNode);
		}
		currentTextNode.content += token.content;
	}
}

const EOF = Symbol("EOF");

function data(c) {
	if (c == "<") {
		return tagOpen;
	} else if (c == EOF) {
		emit({
			type: "EOF"
		});
		return;
	} else {
		emit({
			type: "text",
			content: c
		});
		return data;
	}
}

function tagOpen(c) {
	if (c == "/") {
		return endTageOpen;
	} else if (c.match(/^[a-zA-Z]$/)) {
		currentToken = {
			type: "startTag",
			tagName: ""
		}
		return tagName(c);
	} else {
		emit({
			type: "text",
			content: c
		});
		return;
	}
}

function tagName(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return beforeAttributeName;
	} else if (c == "/") {
		return selfClosingStartTag;
	} else if (c.match(/^[A-Z]$/)) {
		currentToken.tagName += c
		return tagName;
	} else if (c == ">") {
		emit(currentToken);
		return data;
	} else {
		currentToken.tagName += c;
		return tagName;
	}
}

function beforeAttributeName(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return beforeAttributeName;
	} else if (c == "/" || c == ">" || c == EOF) {
		return afterAttributeName(c);
	} else if (c == '=') {

	} else {
		currentAttribute = {
			name: "",
			value: ""
		}
		return beforeAttributeName(c);
	}
}

function afterAttributeName(char) {
	if (char == "/") {
		return selfClosingStartTag
	} else if (char == EOF) {
		return
	} else {
		emit(currentToken)
		return data
	}
}

function attributeName(char) {
	if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) {
		return afterAttributeName(char)
	} else if (char == "=") {
		return beforeAttributeValue
	} else if (char == "\u0000") {
		// return data
	} else if (char == "\"" || char == "\'" || char == "<") {
		return attributeName
	} else {
		currentAttribute.name += char
		return attributeName
	}
}

function beforeAttributeValue(char) {
	if (char.match(/^[\t\n\f ]$/) || char == "/" || char == ">" || char == EOF) {
		return beforeAttributeValue
	} else if (char == "\"") {
		return doubleQuotedAttributeValue
	} else if (char == "\'") {
		return singleQuotedAttributeValue
	} else if (char == ">") {
		emit(currentToken)
		// return data
	} else {
		return UnquotedAttributeValue(char)
	}
}

function doubleQuotedAttributeValue(char) {
	if (char == "\"") {
		currentToken[currentAttribute.name] = currentAttribute.value
		return afterQuotedAttributeValue
	} else if (char == "\u0000") {
		// return data
	} else if (char == EOF) {
		// return data
	} else {
		currentAttribute.value += char
		return doubleQuotedAttributeValue
	}
}

function singleQuotedAttributeValue(char) {
	if (char == "\'") {
		currentToken[currentAttribute.name] = currentAttribute.value
		return afterQuotedAttributeValue
	} else if (char == "\u0000") {
		// return data
	} else if (char == EOF) {
		// return data
	} else {
		currentAttribute.value += char
		return singleQuotedAttributeValue
	}
}

function afterQuotedAttributeValue(char) {
	if (char.match(/^[\t\n\f ]$/)) {
		return beforeAttributeName
	} else if (char == "/") {
		return selfClosingStartTag
	} else if (char == ">") {
		currentToken[currentAttribute.name] = currentAttribute.value
		emit(currentToken)
		return data
	} else if (char == EOF) {
		// return data
	} else {
		// return data
	}
}

function UnquotedAttributeValue(char) {
	if (char.match(/^[\t\n\f ]$/)) {
		currentToken[currentAttribute.name] = currentAttribute.value
		// emit(currentToken)
		return beforeAttributeName
	} else if (char == "/") {
		currentToken[currentAttribute.name] = currentAttribute.value
		// emit(currentToken)
		return selfClosingStartTag
	} else if (char == ">") {
		currentToken[currentAttribute.name] = currentAttribute.value
		emit(currentToken)
		return data
	} else if (char == "\u0000") {
		// return data
	} else if (char == "\"" || char == "\'" || char == "<" || char == "=" || char == "`") {
		// return data
	} else if (char == EOF) {
		// return data
	} else {
		currentAttribute.value += char
		return UnquotedAttributeValue
	}
}


function selfClosingStartTag(char) {
	if (char == ">" || char == "/") {
		currentToken.isSelfClosing = true
		emit(currentToken)
		return data
	} else if (char == "EOF") {
		// return data
	} else {
		// return data
	}
}

module.exports.parseHTML = function parseHTML(html) {
	let state = data
	for (let char of html) {
		state = state(char)
	}
	state = state(EOF)
}
