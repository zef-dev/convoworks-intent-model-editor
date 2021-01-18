import React, { useRef, useState, useEffect } from 'react';
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import '@yaireo/tagify/src/tagify.scss';
import rangy from 'rangy';
import _, { debounce } from 'lodash';
import ContentEditable from 'react-contenteditable';

export default function Utterance(props) {
	const [raw, setRaw] = useState(props.data.raw);
	const [model, setModel] = useState(props.data.model);
	const [selection, setSelection] = useState(null);
	const [whitelist, setWhitelist] = useState(props.data.model.filter(item => item.type).map((item) => ({ value: item.text })));

	const input = useRef(null);

	useEffect(() => {
		if (selection) {
			setTimeout(() => {
				let list = [...whitelist];

				list.map((item, index) => {
					if (selection.text.includes(item.value) || item.value.includes(selection.text)) {
						list.splice(index, 1);
					}
				})

				list = [...list, { value: selection.text }];

				console.log(list);

				setWhitelist(list);
				setSelection(null);
			}, 1000)
		}
	}, [selection]);

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
	}

	if (props.data && raw) {

		let str = raw;

		whitelist.map(item => {
			str = str.replace(item.value, `${item.value}`)
		})

		return (
			<div id="input" >
				<div>{whitelist.map(item => <small> / {item.value}  </small>)}</div>
				<div contentEditable={true} suppressContentEditableWarning={true} onClick={() => {
					handleSelection()
				}} onKeyUp={() => {
					handleSelection()
				}}>
					{str}
				</div>
			</div>
		);
	} else {
		return null
	}
}
