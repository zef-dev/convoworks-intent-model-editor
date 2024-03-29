export const getRandomColor = () => {
	var letters = "0123456789ABCDEF";
	var color = "#";

	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

export const stringToColor = (value) => {
	return value.toLowerCase().getHashCode().intToHSL();
}

String.prototype.getHashCode = function () {
	var hash = 0;
	if (this.length == 0) return hash;
	for (var i = 0; i < this.length; i++) {
		hash = this.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

Number.prototype.intToHSL = function () {
	var shortened = this % 220;
	return "hsl(" + shortened + ",100%, 80%)";
};

export const generateId = (length) => {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export const getCaretCharacterOffsetWithin = (element) => {
	var caretOffset = 0;
	var doc = element.ownerDocument || element.document;
	var win = doc.defaultView || doc.parentWindow;
	var sel;
	if (typeof win.getSelection != "undefined") {
		sel = win.getSelection();
		if (sel.rangeCount > 0) {
			var range = win.getSelection().getRangeAt(0);
			var preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		}
	} else if ((sel = doc.selection) && sel.type != "Control") {
		var textRange = sel.createRange();
		var preCaretTextRange = doc.body.createTextRange();
		preCaretTextRange.moveToElementText(element);
		preCaretTextRange.setEndPoint("EndToEnd", textRange);
		caretOffset = preCaretTextRange.text.length;
	}
	return caretOffset;
}

export const getColor = (index) => {
	let arr = [
		"#56ebd3",
		"#fbacf6",
		"#9ee786",
		"#e4b5ff",
		"#c2e979",
		"#20d8fd",
		"#e8d25c",
		"#42edec",
		"#f3c46f",
		"#5cefba",
		"#e8de7a",
		"#7ee8c0",
		"#e8d98c",
		"#88e99a",
		"#cfdd73",
		"#8be8ad",
		"#dff799",
		"#b5eaa1",
		"#c2d681",
		"#b5e287",
	];

	return arr[index % arr.length]
};

export const preventSubmit = (event) => {
	if (event.keyCode == 13) {
		event.preventDefault();
		return false;
	}
}

// Move caret to a specific point in a DOM element
export const setCaretPosition = (el, pos) => {

	// Loop through all child nodes
	for (var node of el.childNodes) {
		if (node.nodeType == 3) { // we have a text node
			if (node.length >= pos) {
				// finally add our range
				var range = document.createRange(),
					sel = window.getSelection();
				range.setStart(node, pos);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
				return -1; // we are done
			} else {
				pos -= node.length;
			}
		} else {
			pos = setCaretPosition(node, pos);
			if (pos == -1) {
				return -1; // no need to finish the for loop
			}
		}
	}
	return pos; // needed because of recursion stuff
}
