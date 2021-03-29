import React, { useRef, useState, useEffect } from 'react'
import _ from 'lodash'
import { stringToColor } from '../../../helpers/common_constants'
import { IconTrash } from '../../../assets/icon_trash'
import UtteranceSlotValue from './UtteranceSlotValue'
import UtteranceInput from './UtteranceInput'

export const Utterance = React.memo(props => {

    const [raw, setRaw] = useState('');
    const [selection, setSelection] = useState(null);
    const [valid, setValid] = useState(true);

    const wrapper = useRef(null);
    const input = useRef(null);

    const whitelist = input.current && {
        tags: Array.from(input.current.childNodes).filter(item => item.dataset).map(item => {
            return ({
                type: item.dataset.type,
                slot_value: item.dataset.slotValue,
                text: item.textContent,
                color: item.dataset.color,
                target: item
            })
        }).filter(item => item.text.trim().length),
        nodes: Array.from(input.current.childNodes).filter(item => item.textContent.trim().length > 0)
    }

    const active = props.active === props.index;

    useEffect(() => {
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


            let lastChar = str[str.length - 1];
            setRaw(str + `${lastChar === '>' ? ' ' : ''}`);
        }
    }, [props.stateChange]);

    useEffect(() => {
        let isValid = wrapper.current.querySelectorAll("[data-valid='false']").length < 1;

        setValid(isValid);

        if (whitelist && whitelist.nodes) {
            let model = whitelist.nodes.map(item => {
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
            let newUtterance = { raw: raw, model: model }

            if (!_.isEqual(newUtterance, props.utterance)) {
                utterances[props.index] = newUtterance;
                props.setUtterances(utterances)
            }
        }
    }, [whitelist]);

    const validateInput = () => {
        if (whitelist && whitelist.nodes) {
            let nodes = whitelist.nodes;
            let textNodes = nodes.filter(item => !item.tagName);

            console.log(textNodes)

            if (whitelist.tags.length > 0 && textNodes.length < 1) {
                return true
            } else if (textNodes.length > 0) {
                let str = textNodes.map(item => item.textContent.trim()).join(' ');
                let reg = /^[a-zA-Z][a-zA-Z/"/'/`/\s]*$/;
                return reg.test(str.trim());
            } else {
                return true
            }
        } else {
            return true
        }
    }

    const updateRaw = () => {
        setRaw(input.current.innerHTML);
    }

    if (props) {
        return (
            <React.Fragment>
                <div ref={wrapper} data-field-valid={`${valid}`} class={`field field--intent ${active ? 'field--active' : ''}`}>
                    <div
                        className='field__main'
                    >
                        <div className='field__input' data-valid={validateInput() ? 'true' : 'false'}>
                            <UtteranceInput index={props.index} input={input} active={active} setActive={props.setActive} raw={raw} setRaw={setRaw} entities={props.entities} selection={selection} setSelection={setSelection} />
                            <div className="field__actions">
                                {!props.new &&
                                    <button onClick={() => {
                                        props.removeFromUtterances(props.utterance);
                                        document.querySelectorAll('.taggable-text__input')[0].focus();
                                    }}>
                                        <IconTrash />
                                    </button>}
                            </div>
                        </div>
                    </div>
                    {!props.new && whitelist &&
                        <ul className="model-list" style={{ display: active ? 'block' : 'none' }}>
                            <header className="model-list__header">
                                <strong>Parameter name</strong>
                                <strong>Entity</strong>
                                <strong>Resolved value</strong>
                            </header>
                            {whitelist.tags && whitelist.tags.map((item, index) => {
                                return (
                                    <li className="model-list__item">
                                        <UtteranceSlotValue key={index} index={index} target={item.target} slotValue={item.slot_value} whitelist={whitelist} updateRaw={updateRaw} />
                                        <div><button className="mark" type="button" style={{ background: item.color }} onClick={() => setTimeout(() => { setSelection(item.target) }, 220)}>{item.type}</button></div>
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