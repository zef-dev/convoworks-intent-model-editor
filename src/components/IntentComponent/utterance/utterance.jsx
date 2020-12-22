import React, { useRef, useState, useEffect } from 'react';
import Tags from "@yaireo/tagify/dist/react.tagify" // React-wrapper file
import '@yaireo/tagify/src/tagify.scss';

export default function Utterance(props) {
	const [raw, setRaw] = useState(props.data.raw);
	const [model, setModel] = useState(props.data.model);

	const wrapper = useRef(null);
	const input = useRef(null);

	const whitelist = model.filter(item => item.type).map((item) => item.text);

	let parsedRaw = raw;
	whitelist.map(item => {
		parsedRaw = raw.replace(item, `[[${item}]]`);
	})

	console.log(parsedRaw);

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

	if (props.data) {
		return (
			<div onKeyUp={(e) => {
				let sel = window.getSelection();
				let from = sel.anchorOffset;
				let to = from + sel.toString().length;

				if (sel.toString().trim().length) {
					let string = raw;
					console.log(string.substring(from, to));
					// input.current.addTags([sel.toString()])
				}
			}}>
				<button type="button" onClick={() => { console.log(); input.current.loadOriginalValues() }}>click</button>
				<Tags
					inputMode="textarea"
					className="myInput"
					tagifyRef={input}
					name="tags"
					settings={settings}
					value={parsedRaw}
				/>
			</div>
		);
	} else {
		return null
	}
}
