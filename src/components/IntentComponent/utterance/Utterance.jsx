import React, { useRef, useState, useEffect, useCallback } from 'react'
import Tags from '@yaireo/tagify/dist/react.tagify' // React-wrapper file
import '@yaireo/tagify/src/tagify.scss'
import rangy from 'rangy'
import _, { debounce } from 'lodash'
import ContentEditable from 'react-contenteditable'
import { getCaretCharacterOffsetWithin, stringToColor, setCaretPosition } from '../../../helpers/common_constants'
import Dropdown from '../Dropdown'

export const Utterance = (props) => {
	const [raw, setRaw] = useState('');
	const [state, setState] = useState(false);
	const [dropdownState, setDropdownState] = useState({
		position: 0,
		active: false
	});

	const [inputText, setInputText] = useState(null)

	const [model, setModel] = useState(props.data.model)
	const [selection, setSelection] = useState(null)
	const [whitelist, setWhitelist] = useState([]);

	const [selectedNodes, setSelectedNodes] = useState([]);

	const input = useRef('');
	const text = useRef('');
	const inputWrapper = useRef('');
	const cursorPosition = useRef(0);


	useEffect(() => {

		/* 
		MAP MODEL TO STRING
		Object with type param are mapped to MARK tags while those without are mapped to text NODES.
		This is done only on initial component render.
		*/

		if (props.data.model) {
			let str = props.data.model.map(item => {
				if (item.type) {
					return `<mark data-type="${item.type}" data-slot-value="${item.slot_value}" data-text="${item.text}" data-color="${stringToColor(item.text)}" style="background:${stringToColor(item.text)}">${item.text}</mark>`
				} else {
					return item.text
				}
			}).join(' ');

			input.current.innerHTML = str;
			text.current = props.data.raw;
		}
	}, []);

	String.prototype.parseText = function () {

		let str = this;


		if (whitelist.length) {
			let regex = new RegExp(
				whitelist
					.map((item) => item.text.trim())
					.join('|'),
				'gi\s'
			)

			str = str.replace(regex, function (match, index, originalString) {
				return `<mark data-text="${match}" style="background:${stringToColor(match)}">${match}</mark>`
			});

		}
		return str
	};

	function createNode(type, slot_value, text) {
		let mark = document.createElement('mark');
		let newTextNode = document.createTextNode(text);

		mark.appendChild(newTextNode);
		mark.textContent = mark.textContent.trim();
		mark.setAttribute('data-type', type);
		mark.setAttribute('data-slot-value', slot_value);
		mark.setAttribute('data-text', mark.textContent.trim());
		mark.setAttribute('data-color', stringToColor(mark.textContent.trim()));
		mark.style.background = stringToColor(text);

		return mark;
	}

	const mapToWhitelist = () => {
		let arr = Array.from(input.current.childNodes).filter(item => item.dataset).map(item => {
			return ({
				type: item.dataset.type,
				slot_value: item.dataset.slotValue,
				text: item.textContent,
				color: item.dataset.color
			})
		}).filter(item => item.text.trim().length);

		setTimeout(() => {
			setWhitelist(arr);	
			setSelection(null);
		}, 220)
	}

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
			nodes = nodes.filter(item => item.tagName === "MARK").map(item => item.textContent.trim());

			if (targetNode.tagName === "MARK") {
				setSelectedNodes([...nodes, targetNode.textContent.trim()]);
			} else {
				setSelectedNodes(nodes);
			}
		}

		/* 
		SET CURRENT SELECTION
		*/
		if (sel.toString().length) {
			setSelection(sel)
		} else if (targetNode.tagName === "MARK") {
		} else {
			setSelection(null);
		}
	}


	const tagSelection = (type, slot_value) => {
		let mark = createNode(type, slot_value, selection.toString());

		if (mark) {
			selection.getRangeAt(0).extractContents();
			selection.getRangeAt(0).insertNode(mark);

			if (mark.parentElement.tagName === "MARK") {
				mark.parentElement.replaceWith(...mark.parentElement.childNodes);
				mark.innerHTML = mark.textContent.trim();
			}

			input.current.childNodes.forEach((item, index) => {
				if (item.tagName === "MARK") {
					if (item.innerHTML.slice(-1).includes(' ')) {
						item.innerHTML = item.innerHTML.trim();
					}
				}
			})

			text.current = input.current.innerHTML;
			mapToWhitelist();
		}


		/* let arr = Array.from(input.current.childNodes).map(item => {
			let obj;
			if (item.dataset) {
				obj = {
					text: item.dataset.text,
					type: item.dataset.type,
					slot_value: item.dataset.slotValue
				}
			} else {
				obj = {
					text: item.textContent.trim()
				}
			}

			return obj;
		}) */

		// setModel(arr);

		/* 
		REMOVE OVERLAPPING NODES FROM THE WHITELIST
		Check if any of whitelist items exist in selected nodes array.
		If they do exist in selected nodes, they will be filtered out.
		*/
		/* let list = whitelist.filter(item => !selectedNodes.includes(item.text));
		list = [...list, { text: selection, type: type, slot_value: slot_value }]
		setSelectedNodes([]);
		setWhitelist(list);
		setSelection(null); */
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
									html={text.current}	
									onChange={(e) => {
										text.current = e.target.value;

										/* let sel = window.getSelection().anchorNode.parentElement;

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

										}

										 */

										mapToWhitelist();
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
										<div><mark style={{ background: item.color }}>{item.type}</mark></div>
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
}