import React, { useRef, useState, useEffect, memo } from 'react'
import Tags from '@yaireo/tagify/dist/react.tagify' // React-wrapper file
import '@yaireo/tagify/src/tagify.scss'
import rangy from 'rangy'
import _, { debounce } from 'lodash'
import ContentEditable from 'react-contenteditable'
import { getCaretCharacterOffsetWithin, stringToColor } from '../../../helpers/common_constants'

export default function Utterance(props) {
	const [raw, setRaw] = useState('');
	const [state, setState] = useState(false);

	const [modalState, setModalState] = useState({
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
	const modalRef = useRef('');
	const tagsRef = useRef('');
	const text = useRef('');
	const targetText = useRef('')

	const isArrayEqual = function (x, y) {
		return _(x).xorWith(y, _.isEqual).isEmpty()
	}

	useEffect(() => {
		text.current = props.data.raw;
	}, [])

	const handleChange = evt => {
		text.current = evt.target.value;
		tagsRef.current.innerHTML = parseText(evt.target.value);
	};

	function parseText(string) {
		if (string) {
			let str = string.replace(/\s+/g, ' ').trim()
			let regex = new RegExp(
				whitelist
					.map((item) => item.text.replace(/\s+/g, ' ').trim())
					.join('|'),
				'gi'
			)

			str = str.replace(regex, function (matched) {
				return `<mark style="background:${stringToColor(matched)}">${matched}</mark>`
			})

			return str
		}
	}

	const tagSelection = () => {
		setTimeout(() => {
			let list = [...whitelist]

			//				console.log(list, list.filter(item => selection.includes(item)))

			list.map((item, index) => {
				if (selection.includes(item.text) || item.text.includes(selection)) {
					list.splice(index, 1)
				}
			})

			list = [...list, { text: selection, type: '', slot_value: '' }]

			setWhitelist(list);
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

		if (sel.toString().length) {
			setSelection(sel.toString())
		} else {
			setSelection(null);
		}
	}

	// generate a random color (in HSL format, which I like to use)
	function getRandomColor() {
		function rand(min, max) {
			return min + Math.random() * (max - min)
		}

		var h = rand(1, 360) | 0,
			s = rand(40, 70) | 0,
			l = rand(65, 72) | 0

		return 'hsl(' + h + ',' + s + '%,' + l + '%)'
	}

	useEffect(() => {
		let s = window.getSelection();
		let oRange = s.getRangeAt(0); //get the text range
		let oRect = oRange.getBoundingClientRect();

		setModalState({
			position: oRect.x,
			active: selection !== null
		})


	}, [selection]);

	if (props.data) {

		let modalStyles = {
			position: 'absolute',
			top: '100%',
			transition: 'all 220ms ease-in-out',
			visibility: modalState.active ? 'visible' : 'hidden',
			opacity: modalState.active ? '1' : '0',
			left: modalState.position
		}

		return (
			<div class={`field field--intent ${props.active === props.index ? 'field--active' : ''}`} onClick={() => {
				props.setActive(props.index)
			}}>
				<div
					className='field__main'
					id='input'
				>
					<div className='field__input'>
						<div class='taggable-text'>
							<ContentEditable
								className='taggable-text__input'
								html={text.current}
								onChange={handleChange}
								onKeyDown={(e) => {
									console.log(getCaretCharacterOffsetWithin(e.target))
								}}
								onMouseUp={(e) => {
									handleSelection()
									console.log(getCaretCharacterOffsetWithin(e.target))
								}}
								onKeyUp={(e) => {
									handleSelection();
								}}
							/>
							<div ref={tagsRef} className="taggable-text__tags" contentEditable={false} />
						</div>
					</div>
				</div>
				<div>
					{whitelist.map(item => {
						return (<div>
							{item.text}
						</div>)
					})}
				</div>
				<div class="dropdown" ref={modalRef} style={modalStyles}>
					<div class="dropdown__inner"><div class="dropdown__selection">Selection: <strong>{selection}</strong></div></div>
					<button onClick={() => {tagSelection()}}>TAG!</button>
				</div>
			</div>
		)
	} else {
		return null
	}
}
