import React, { useRef, useState, useEffect } from 'react';
//import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
//import '@yaireo/tagify/src/tagify.scss';
import rangy from 'rangy';
import _ from 'lodash';

export default function Utterance(props) {
	const [raw, setRaw] = useState(props.data.raw);
	const [model, setModel] = useState(props.data.model);
	const [selection, setSelection] = useState(null);
	const [whitelist, setWhitelist] = useState(props.data.model.filter(item => item.type).map((item) => ({ text: item.text, type: item.type })));

	const wrapper = useRef(null);
	const input = useRef(null);

	let parsedRaw = raw;
	whitelist.map(item => {
		parsedRaw = raw.replace(item, `${item.text}`);
	})

	const settings = {
		mode: 'mix',
		keepInvalidTags: false,         // do not remove invalid tags (but keep them marked as invalid)
		editTags: {
			clicks: 1,              // single click to edit a tag
			keepInvalid: false      // if after editing, tag is invalid, auto-revert
		},
		// maxTags: 6,
		whitelist: whitelist,
		backspace: "edit",
		placeholder: "Type something",
	};

	const updateInput = () => {
		let value = input.current.state.lastOriginalValueReported;
	}

	const updateWhitelist = () => {
		let list = [...whitelist];

		// ignore strings that are already present in the whitelist
		if (selection && !list.find(item => item.text === selection.string)) {
			console.log(selection.nodes);
			list.map((item, index) => {
				let arr1 = item.text.split(' ');
				let arr2 = selection.string.split(' ');

				console.log(arr1, arr2)

				let intersection = _.intersection(
					arr1, arr2);

					console.log(intersection)

				if (intersection.length) {
					list.splice(index, 1);
				}

				console.log(list);
			});

			setWhitelist([...list, { text: selection.string, type: '' }]);
		}

		mapWhitelist();
	}

	function mapWhitelist() {
		let str = props.data.raw;
		whitelist.map(item => {
			str = str.replace(item.text, `#${item.text}#`);
		})

		let arr = str.split('#').filter(item => item.trim().length > 0).map(item => item.trim()).map(item => {
			let modelObj = whitelist.find(val => val.text === item);
			if (modelObj) {
				return modelObj;

			} else {
				return ({
					text: item
				})
			}
		});

		console.log(arr);

		setSelection(null);
	}

	if (props.data) {
		return (
			<div id="input" onKeyUp={(e) => {
				let sel = rangy.getSelection();

				if (sel.toString().trim().length) {
					let nodes = sel.getRangeAt(0).getNodes();
					let nodeArray = Array.from(nodes).filter(node => node.nodeName === '#text').filter(node => node.textContent.trim().length);
					let selectedString = nodeArray.map(node => node.textContent).join(' ');
					setSelection({ string: selectedString, nodes: nodeArray });

					setTimeout(() => {
						updateWhitelist();
					}, 1000)
				}
			}}>
				<div>{whitelist.map(item => <small> / {item.text}  </small>)}</div>
				<div contentEditable={true}>{parsedRaw.split(' ').map(item => {
					if (whitelist.find(val => val.text === item)) {
						return <b>{item}&nbsp;</b>
					} else {
						return <React.Fragment>{item}&nbsp;</React.Fragment>
					}
				})}</div>
			</div>
		);
	} else {
		return null
	}
}
