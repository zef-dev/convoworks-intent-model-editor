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
		let sel = rangy.getSelection();

		if (sel.toString().trim().length) {
			let nodes = sel.getRangeAt(0).getNodes();
			let nodeArray = Array.from(nodes).filter(node => node.nodeName === '#text').filter(node => node.textContent.trim().length);
			let selectedString = nodeArray.map(node => node.textContent).join(' ');

			setSelection({ text: selectedString, nodes: nodeArray });
		}
	}

	if (props.data && raw) {

		let str = raw;

		whitelist.map(item => {
			str = str.replace(item.value, `${item.value}`)
		})

		str = str.split(' ').map(item => {
			return `<span>${item}</span>`
		}).join(' ');
		
		return (
			<div id="input" onKeyUp={() => {
				handleSelection()
			}} onMouseUp={() => {
				handleSelection()
			}}>
				<div>{whitelist.map(item => <small> / {item.value}  </small>)}</div>
				<div contentEditable={true} suppressContentEditableWarning={true} dangerouslySetInnerHTML={{ __html: str }} />
			</div>
		);
	} else {
		return null
	}
}
