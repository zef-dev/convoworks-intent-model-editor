import React, { useRef, useState, useEffect } from 'react'
import _ from 'lodash'
import { stringToColor } from '../../../helpers/common_constants'
import { IconTrash } from '../../../assets/icon_trash'
import UtteranceSlotValue from './UtteranceSlotValue'
import UtteranceInput from './UtteranceInput'

export const Utterance = React.memo(props => {

    const [whitelist, setWhitelist] = useState([]);
    const [raw, setRaw] = useState('');
    const [valid, setValid] = useState(true);
    const [selection, setSelection] = useState(null);

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


    if (props) {
        return (
            <React.Fragment>
                <div class={`field ${valid ? 'field--valid' : 'field--invalid'} field--intent ${active ? 'field--active' : ''}`}>
                    <div
                        className='field__main'
                    >
                        <div className='field__input'>
                            <UtteranceInput index={props.index} active={active} setActive={props.setActive} raw={raw} setRaw={setRaw} setWhitelist={setWhitelist} entities={props.entities} selection={selection} setSelection={setSelection} />
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
                    {!props.new && active && whitelist &&
                        <ul className="model-list">
                            <header className="model-list__header">
                                <strong>Parameter name</strong>
                                <strong>Entity</strong>
                                <strong>Resolved value</strong>
                            </header>
                            {whitelist.tags && whitelist.tags.map((item, index) => {
                                return (
                                    <li className="model-list__item">
                                        <UtteranceSlotValue key={`${item.slot_value}_${index}`} target={item.target} slotValue={item.slot_value} />
                                        <div><button className="mark" type="button" style={{ background: item.color }} onClick={() => setTimeout(() => {setSelection(item.target)}, 220)}>{item.type}</button></div>
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