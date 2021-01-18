import React, { useRef, useState, useEffect } from 'react';
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import '@yaireo/tagify/src/tagify.scss';
import rangy from 'rangy';
import _, { debounce } from 'lodash';
import ContentEditable from 'react-contenteditable';

export default function Utterance(props) {
	const [raw, setRaw] = useState(props.data.raw);
	const [innerText, setInnerText] = useState(null);
	const [model, setModel] = useState(props.data.model);
	const [selection, setSelection] = useState(null);
	const [whitelist, setWhitelist] = useState(props.data.model.filter(item => item.type).map((item) => ({ text: item.text, type: item.type, slot_value: item.slot_value })));

	const input = useRef(null);

	const isArrayEqual = function (x, y) {
		return _(x).xorWith(y, _.isEqual).isEmpty();
	};

	useEffect(() => {
		if (selection) {
			setTimeout(() => {
				let list = [...whitelist];

				console.log(list, list.filter(item => selection.includes(item)))

				list.map((item, index) => {
					if (selection.includes(item.text) || item.text.includes(selection)) {
						list.splice(index, 1);
					}
				})

				list = [...list, { text: selection, type: '', slot_value: '' }];

				setWhitelist(list);
				setSelection(null);
			}, 1000)
		}
	}, [selection]);

	useEffect(() => {
		let str = raw.replace(/\s+/g, " ").trim();
		let regex = new RegExp(whitelist.map(item => item.text.replace(/\s+/g, " ").trim()).join("|"), "gi");

		str = str.replace(regex, function (matched) {
			return `[[${matched}]]`
		});

		setInnerText(str);

	}, [whitelist])

	const handleSelection = () => {
		var sel;

		// Check for existence of window.getSelection() and that it has a
		// modify() method. IE 9 has both selection APIs but no modify() method.
		if (window.getSelection && (sel = window.getSelection()).modify) {
			sel = window.getSelection();
			if (!sel.isCollapsed) {

				// Detect if selection is backwards
				var range = document.createRange();
				range.setStart(sel.anchorNode, sel.anchorOffset);
				range.setEnd(sel.focusNode, sel.focusOffset);
				var backwards = range.collapsed;
				range.detach();

				// modify() works on the focus of the selection
				var endNode = sel.focusNode, endOffset = sel.focusOffset;
				sel.collapse(sel.anchorNode, sel.anchorOffset);

				var direction = [];
				if (backwards) {
					direction = ['backward', 'forward'];
				} else {
					direction = ['forward', 'backward'];
				}

				sel.modify("move", direction[0], "character");
				sel.modify("move", direction[1], "word");
				sel.extend(endNode, endOffset);
				sel.modify("extend", direction[1], "character");
				sel.modify("extend", direction[0], "word");
			}
		} else if ((sel = document.selection) && sel.type != "Control") {
			var textRange = sel.createRange();
			if (textRange.text) {
				textRange.expand("word");
				// Move the end back to not include the word's trailing space(s),
				// if necessary
				while (/\s$/.test(textRange.text)) {
					textRange.moveEnd("character", -1);
				}
				textRange.select();
			}
		}

		if (sel.toString().length) {
			setSelection(sel.toString());
		}

	}

	if (props.data && raw) {

		let str = raw;

		whitelist.map(item => {
			str = str.replace(item.text, `${item.text}`)
		})

		return (
			<div id="input" >
				<div>{whitelist.map(item => <small> / {item.text}  </small>)}</div>
				<ContentEditable
					innerRef={input}
					html={innerText} // innerHTML of the editable div
					disabled={false}
					onMouseUp={() => {
						handleSelection()
					}} onKeyUp={() => {
						handleSelection()
					}}      // use true to disable editing
				/>
			</div>
		);
	} else {
		return null
	}
}
