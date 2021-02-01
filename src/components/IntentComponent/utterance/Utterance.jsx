import React, { useRef, useState, useEffect, useCallback } from 'react'
import Tags from '@yaireo/tagify/dist/react.tagify' // React-wrapper file
import '@yaireo/tagify/src/tagify.scss'
import rangy from 'rangy'
import _, { debounce } from 'lodash'
import ContentEditable from 'react-contenteditable'
import { getCaretCharacterOffsetWithin, stringToColor, setCaretPosition } from '../../../helpers/common_constants'
import Dropdown from '../Dropdown'

function Utterance(props) {
	const [raw, setRaw] = useState('');
	const [state, setState] = useState(false);

	const [tagEditState, setTagEditState] = useState(false);

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

	const input = useRef('');
	const text = useRef('');
	const inputWrapper = useRef('');
	const cursorPosition = useRef(0)

	useEffect(() => {
		input.current.innerHTML = props.data.raw.parseText();
		text.current = props.data.raw;
	}, []);

	String.prototype.parseText = function () {
		if (this.length) {
			let str = this.replace(/\s+/g, ' ').trim();

			let regex = new RegExp(
				whitelist
					.map((item) => item.text.replace(/\s+/g, ' ').trim())
					.join('|'),
				'gi\s'
			)


			str = str.replace(regex, function (matched) {
				let isLastWord = str.lastIndexOf(matched) + matched.length === str.length;
				let matchedObject = whitelist.find(item => item.text === matched);
				return `<mark data-type="${matchedObject.type}" data-slot-value="${matchedObject.slot_value}" data-text="${matched}" style="background:${stringToColor(matched)}">${matched}</mark>${isLastWord ? ' ' : ''}`
			});

			return str
		}
	};


	const tagSelection = (type, slot_value) => {
		setTimeout(() => {


			let list = [...whitelist];

			let selectionPosition = {
				from: text.current.indexOf(selection),
				to: text.current.indexOf(selection) + selection.length
			}

			list.map((item, index) => {

				let itemPosition = {
					from: text.current.indexOf(item.text),
					to: text.current.indexOf(item.text) + item.text.length
				}

				switch (true) {
					case (selectionPosition.from === itemPosition.from):
						list.splice(index, 1);
					case (selectionPosition.to === itemPosition.to):
						list.splice(index, 1);
					case (selectionPosition.from <= itemPosition.from && selectionPosition.to >= itemPosition.to):
						list.splice(index, 1);
					case (selectionPosition.from >= itemPosition.from && selectionPosition.to <= itemPosition.to):
						list.splice(index, 1);
					case (selectionPosition.from <= itemPosition.from && selectionPosition.to >= itemPosition.from):
						list.splice(index, 1);
					case (selectionPosition.from >= itemPosition.from && selectionPosition.from <= itemPosition.to):
						list.splice(index, 1);
					case (item.text === selection):
						list.splice(index, 1);
						break;
					default:
						break;
				}
			})

			list = [...list, { text: selection, type: type, slot_value: slot_value }]

			setWhitelist(list);
			setSelection(null);
		}, 0)
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

		if (sel.toString().length) {
			setSelection(sel.toString().trim())
		} else if (sel.toString.length === 0) {
			let mark = sel.focusNode.parentNode;

			if (mark.tagName === 'MARK') {
				setTagEditState(true);
				setSelection(mark.dataset.text);
			} else {
				setTagEditState(false);
				setSelection(null);
			}
		} else {
			setSelection(null);
		}

		cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
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
	}, [selection]);

	useEffect(() => {
		setCaretPosition(input.current, cursorPosition.current)
	}, [whitelist, tagEditState]);

	if (props.data && props.data.raw) {
		return (
			<React.Fragment>
				tag edit state: {tagEditState.toString()}
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
									}}
									onMouseUp={(e) => {
										handleSelection()
									}}
									onKeyDown={(e) => {
										if (tagEditState) {
											console.log(e)
										}
	
										if (e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38) {
											e.preventDefault();
										}
									}}
									onKeyUp={(e) => {
										handleSelection();
									}}
								/>
								{/* 							<div ref={tagsRef} className="taggable-text__tags" contentEditable={false} />
	 */}						</div>
							<Dropdown dropdownState={dropdownState} entities={props.entities} selection={selection} setSelection={setSelection} tagSelection={tagSelection} />
						</div>
					</div>
					<ul className="model-list">
						<header className="model-list__header">
							<strong>Parameter name</strong>
							<strong>Entity</strong>
							<strong>Resolved value</strong>
						</header>
						{whitelist.map(item => {
							return (
								<li className="model-list__item">
									<div>{item.slot_value.length ? item.slot_value : item.type}</div>
									<div><mark style={{ background: stringToColor(item.text) }}>{item.type}</mark></div>
									<div>{item.text}</div>
								</li>
							)
						})}
					</ul>
				</div>
			</React.Fragment>
		)
	} else {
		return null
	}
}

export default React.memo(Utterance);