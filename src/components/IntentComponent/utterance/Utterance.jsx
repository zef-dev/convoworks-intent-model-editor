import React, { useRef, useState, useEffect, useCallback } from 'react'
import Tags from '@yaireo/tagify/dist/react.tagify' // React-wrapper file
import '@yaireo/tagify/src/tagify.scss'
import rangy from 'rangy'
import _, { debounce } from 'lodash'
import ContentEditable from 'react-contenteditable'
import { getCaretCharacterOffsetWithin, stringToColor, setCaretPosition } from '../../../helpers/common_constants'
import Dropdown from '../Dropdown'

export const Utterance = React.memo(props => {
	const [raw, setRaw] = useState('');
	const [state, setState] = useState(false);
	const [dropdownState, setDropdownState] = useState({
		position: 0,
		active: false
	});

	const [inputText, setInputText] = useState(null)

	const [model, setModel] = useState(props.data.model)
	const [selection, setSelection] = useState(null)
	const [whitelist, setWhitelist] = useState(
		props.data.model
			.filter((item) => item.type)
			.map((item) => ({
				text: item.text,
				type: item.type,
				slot_value: item.slot_value
			}))
	)

	const [selectedNodes, setSelectedNodes] = useState([]);

	const input = useRef('');
	const text = useRef('');
	const inputWrapper = useRef('');
	const cursorPosition = useRef(0);


	useEffect(() => {
		input.current.innerHTML = props.data.raw.parseText();
		text.current = props.data.raw;
	}, []);

	String.prototype.parseText = function () {

		let str = this;


		if (whitelist.length) {
			let regex = new RegExp(
				whitelist
					.map((item) => item.text.trim())
					.join('|'),
				'g\s'
			)

			console.log(regex)

			str = str.replace(regex, function (match, index, originalString) {
				return `<mark data-text="${match}" style="background:${stringToColor(match)}">${match}</mark>`
			});

		}
		return str
	};

	const handleSelection = () => {
		var sel

		// Check for existence of window.getSelection() and that it has a
		// modify() method. IE 9 has both selection APIs but no modify() method.
		if (window.getSelection && (sel = window.getSelection()).modify) {
			sel = window.getSelection()
			if (!sel.isCollapsed) {
				// Detect if selection is backwards
				var range = document.createRange()
				range.setStart(sel.anchorNode, sel.anchorOffset)
				range.setEnd(sel.focusNode, sel.focusOffset)
				var backwards = range.collapsed
				range.detach()

				// modify() works on the focus of the selection
				var endNode = sel.focusNode,
					endOffset = sel.focusOffset
				sel.collapse(sel.anchorNode, sel.anchorOffset)

				var direction = []
				if (backwards) {
					direction = ['backward', 'forward']
				} else {
					direction = ['forward', 'backward']
				}

				sel.modify('move', direction[0], 'character')
				sel.modify('move', direction[1], 'word')
				sel.extend(endNode, endOffset)
				sel.modify('extend', direction[1], 'character')
				sel.modify('extend', direction[0], 'word')
			}
		} else if ((sel = document.selection) && sel.type != 'Control') {
			var textRange = sel.createRange()
			if (textRange.text) {
				textRange.expand('word')
				// Move the end back to not include the word's trailing space(s),
				// if necessary
				while (/\s$/.test(textRange.text)) {
					textRange.moveEnd('character', -1)
				}
				textRange.select()
			}
		}

		/* 
		GET ALL SELECTED NODES
		Get all nodes contained in user selection. 
		Filter nodes of type MARK. These nodes will be removed from the whitelist. 
		*/
		let nodes = rangy.getSelection().getRangeAt(0).getNodes();
		let targetNode = sel.focusNode.parentNode;
		if (nodes) {
			nodes = nodes.filter(item => item.tagName === "MARK").map(item => item.textContent);

			if (targetNode.tagName === "MARK") {
				setSelectedNodes([...nodes, targetNode.textContent]);
			} else {
				setSelectedNodes(nodes);
			}
		}

		/* 
		SET CURRENT SELECTION
		*/
		if (sel.toString().length) {
			setSelection(sel.toString().trim())
		} else if (sel.focusNode.parentNode.tagName === 'MARK') {
			setSelection(sel.focusNode.parentNode.textContent)
		} else {
			setSelection(null);
		}
	}

	const tagSelection = (type, slot_value) => {
		/* 
		REMOVE OVERLAPPING NODES FROM THE WHITELIST
		Check if any of whitelist items exist in selected nodes array.
		If they do exist in selected nodes, they will be filtered out.
		*/
		let list = whitelist.filter(item => !selectedNodes.includes(item.text));
		list = [...list, { text: selection, type: type, slot_value: slot_value }]
		setSelectedNodes([]);
		setWhitelist(list);
		setSelection(null);
	}

	useEffect(() => {
		let s = window.getSelection();

		if (s && s.rangeCount > 0) {
			let oRange = s.getRangeAt(0); //get the text range
			let oRect = oRange.getBoundingClientRect();

			setDropdownState({
				position: oRect.x,
				active: selection !== null
			})
		}

		// cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
	}, [selection]);

	useEffect(() => {
		/* position caret after the whitelist is updated */
		setCaretPosition(input.current, cursorPosition.current);
	}, [whitelist]);

	if (props.data && props.data.raw) {
		return (
			<React.Fragment>
				<div class={`field field--intent ${props.active === props.index ? 'field--active' : ''}`} onClick={() => {
					props.setActive(props.index)
				}}>
					<div
						className='field__main'
						id='input'
					>
						<div className='field__input'>
							<div class='taggable-text' ref={inputWrapper}>
								<ContentEditable
									innerRef={input}
									className='taggable-text__input'
									html={text.current.parseText()}
									onChange={(e) => {
										text.current = e.currentTarget.textContent;
										let sel = window.getSelection().anchorNode.parentElement;

										if (sel.tagName === 'MARK') {
											let arr = [...whitelist];
											let item = arr.find(item => item.text === sel.dataset.text);
											let index = arr.indexOf(item);

											arr[index] = { ...item, text: sel.textContent };
											setWhitelist(arr.filter(obj => obj.text.length));
										} else {
											let arr = whitelist.filter(item =>
												text.current.includes(item.text)
											);
	
											setWhitelist(arr)
										}

										cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
									}}
									onMouseUp={(e) => {
										handleSelection()
										cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
									}}

									onKeyDown={(e) => {
										if (e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38) {
											e.preventDefault();
										}
									}}

									onKeyUp={(e) => {
										cursorPosition.current = getCaretCharacterOffsetWithin(input.current);

										handleSelection();
									}}
								/>
								{/* 							<div ref={tagsRef} className="taggable-text__tags" contentEditable={false} />
	 */}						</div>
							<Dropdown dropdownState={dropdownState} entities={props.entities} selection={selection} setSelection={setSelection} tagSelection={tagSelection} />
						</div>
					</div>
					{props.active === props.index &&
						<ul className="model-list">
							<header className="model-list__header">
								<strong>Parameter name</strong>
								<strong>Entity</strong>
								<strong>Resolved value</strong>
							</header>
							{whitelist.map((item, index) => {
								return (
									<li className="model-list__item">
										<input defaultValue={item.slot_value.length ? item.slot_value : item.type} />
										<div><mark style={{ background: stringToColor(item.text) }}>{item.type}</mark></div>
										<div>{item.text}</div>
									</li>
								)
							})}
						</ul>
					}
				</div>
			</React.Fragment>
		)
	} else {
		return null
	}
})