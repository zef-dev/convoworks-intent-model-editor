import React, { useRef, useState, useEffect } from 'react'
import '@yaireo/tagify/src/tagify.scss'
import rangy from 'rangy'
import _ from 'lodash'
import ContentEditable from 'react-contenteditable'
import { getCaretCharacterOffsetWithin, stringToColor, setCaretPosition } from '../../../helpers/common_constants'
import Dropdown from '../Dropdown'
import { IconTrash } from '../../../assets/icon_trash'

export const Utterance = (props) => {
    const [dropdownState, setDropdownState] = useState({
        position: 0,
        active: false
    });

    const [selection, setSelection] = useState(null)
    const [whitelist, setWhitelist] = useState([]);
    const [valid, setValid] = useState(true);

    const active = props.active === props.index;

    const input = useRef(null);
    const text = useRef(null);
    const inputWrapper = useRef('');
    const cursorPosition = useRef(null);

    /* handle validation */
    useEffect(() => {
        let expression = props.utterance.model.filter(item => !item.type).map(item => item.text).join(' ');
        let slotValues = props.utterance.model.filter(item => item.slot_value).map(item => item.slot_value).join(' ');
        let reg = /^[a-zA-Z][a-zA-Z/"/'/`/\s]*$/;

        setValid(reg.test(expression))

    }, [props.utterance.model])

    useEffect(() => {
        /* 
        MAP MODEL TO STRING
        Object with type param are mapped to MARK tags while those without are mapped to text NODES.
        This is done only on initial component render.
        */

        if (props.utterance.model) {
            let str = '';
            if (props.utterance.model.length) {
                str = props.utterance.model.map(item => {
                    if (item.type) {
                        return `<mark data-type="${item.type}" data-slot-value="${item.slot_value}" data-text="${item.text}" data-color="${stringToColor(item.text)}" style="background:${stringToColor(item.text)}">${item.text}</mark>`
                    } else {
                        return item.text
                    }
                }).join(' ');
            }

            input.current.innerHTML = str + ' ';
            text.current = str + ' ';
            mapToWhitelist();
        }
    }, [props.stateChange]);

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
        }

        /* 
        SET CURRENT SELECTION
        */
        if (sel.toString().length > 0) {
            let sel = rangy.getSelection()
            setSelection(sel)
        } else {
            setSelection(null);
        }
    }

    const tagSelection = (type, slot_value) => {
        if (selection) {
            let mark = createNode(type, slot_value, selection.toString());

            if (mark) {
                selection.getRangeAt(0).extractContents();
                selection.getRangeAt(0).insertNode(mark);

                if (mark.parentElement.tagName === "MARK") {
                    mark.parentElement.replaceWith(...mark.parentElement.childNodes);
                    mark.innerHTML = mark.textContent.trim();
                }

                input.current.childNodes.forEach((item) => {
                    if (item.tagName === "MARK") {
                        if (item.innerHTML.slice(-1).includes(' ')) {
                            item.innerHTML = item.innerHTML.trim();
                        }
                    }
                })

                text.current = input.current.innerHTML;
                mapToWhitelist();
                setSelection(null);
                cursorPosition.current && setCaretPosition(input.current, cursorPosition.current);
            }
        }
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
        } else {
            setDropdownState({ ...dropdownState, active: false });
        }
    }, [selection, active]);

    useEffect(() => {
        if (input.current.childNodes.length) {
            let model = Array.from(input.current.childNodes).map(item => {
                if (item.dataset) {
                    return ({
                        type: item.dataset.type,
                        text: item.textContent.trim(),
                        slot_value: item.dataset.slotValue
                    })
                } else {
                    return ({ text: item.textContent.trim() }
                    )
                }
            }).filter(item => item.text.length)

            let raw = model.map(item => item.text).join(' ');
            let utterances = [...props.utterances];
            utterances[props.index] = { raw: raw, model: model }
            props.setUtterances(utterances)
        }

    }, [whitelist]);

    if (props.utterance) {
        return (
            <React.Fragment>
                <div class={`field ${props.valid ? 'field--valid' : 'field--invalid'} field--intent ${props.active === props.index ? 'field--active' : ''}`}>
                    <div
                        className='field__main'
                        id='input'
                    >
                        <div className='field__input'>
                            <div class='taggable-text' ref={inputWrapper}>
                                <ContentEditable
                                    data-placeholder="Enter reference value"
                                    innerRef={input}
                                    className='taggable-text__input'
                                    html={text.current}
                                    onChange={(e) => {
                                        text.current = e.target.value;
                                        cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
                                        mapToWhitelist();
                                    }}
                                    onMouseUp={() => {
                                        handleSelection();
                                        cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
                                    }}

                                    onKeyDown={(e) => {
                                        if (e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38) {
                                            e.preventDefault();

                                            if (e.keyCode === 13) {
                                                document.querySelectorAll('.taggable-text__input')[0].focus();
                                            }
                                        }
                                    }}
                                    onKeyUp={(e) => {
                                        handleSelection();
                                        cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
                                    }}
                                    onFocus={() => {
                                        props.setActive(props.index)
                                    }}
                                />
                            </div>
                            <Dropdown dropdownState={dropdownState} entities={props.entities} selection={selection} setSelection={setSelection} tagSelection={tagSelection} />
                            <div className="field__actions">
                                {!props.utterance.new && <button onClick={() => { props.removeFromUtterances(props.utterance) }}><IconTrash /></button>}
                            </div>
                        </div>
                    </div>
                    {props.active === props.index &&
                        <ul className="model-list">
                            {whitelist.length > 0 &&
                                <header className="model-list__header">
                                    <strong>Parameter name</strong>
                                    <strong>Entity</strong>
                                    <strong>Resolved value</strong>
                                </header>
                            }
                            {whitelist.map((item, index) => {
                                return (
                                    <li className="model-list__item">
                                        <input defaultValue={item.slot_value.length ? item.slot_value : item.type} onChange={(e) => {
                                            let arr = [...whitelist];
                                            arr[index].slot_value = e.target.value;
                                            setWhitelist(arr);
                                            props.setStateChange(!props.stateChange);
                                        }} />
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