import React, { useRef, useState, useEffect } from 'react'
import _ from 'lodash'
import { stringToColor } from '../../../helpers/common_constants'
import { IconTrash } from '../../../assets/icon_trash'
import UtteranceSlotValue from './UtteranceSlotValue'
import UtteranceInput from './UtteranceInput'

export const Utterance = (props) => {

    const [whitelist, setWhitelist] = useState([]);
    const [raw, setRaw] = useState('');
    const [valid, setValid] = useState(true);

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
            setRaw(str + ' ');
        }
    }, []);

    useEffect(() => {
        /* if (input.current.childNodes.length) {
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
        } */
    }, [whitelist]);

    if (raw) {
        return (
            <React.Fragment>
                <div data-new={props.utterance.new} class={`field ${valid ? 'field--valid' : 'field--invalid'} field--intent ${active ? 'field--active' : ''}`}>
                    <div
                        className='field__main'
                    >
                        <div className='field__input'>
                            <UtteranceInput index={props.index} active={active} setActive={props.setActive} raw={raw} setRaw={setRaw} setWhitelist={setWhitelist} entities={props.entities} />
                            <div className="field__actions">
                                {!props.utterance.new &&
                                    <button onClick={() => {
                                        props.removeFromUtterances(props.utterance);
                                        document.querySelectorAll('.taggable-text__input')[0].focus();
                                    }}>
                                        <IconTrash />
                                    </button>}
                            </div>
                        </div>
                    </div>
                    {active && whitelist &&
                        <ul className="model-list">
                            <header className="model-list__header">
                                <strong>Parameter name</strong>
                                <strong>Entity</strong>
                                <strong>Resolved value</strong>
                            </header>
                            {whitelist.map((item, index) => {
                                return (
                                    <li className="model-list__item">
                                        <UtteranceSlotValue key={`${item.slot_value}_${index}`} target={item.target} slotValue={item.slot_value} />
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