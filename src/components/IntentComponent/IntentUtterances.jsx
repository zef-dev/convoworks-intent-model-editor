import React, { useState, useEffect, useRef } from 'react'
import { Utterance } from './utterance/Utterance.jsx'

const IntentUtterances = (props) => {
	const [active, setActive] = useState(null);
	const removeFromUtterances = (object) => {
		let arr = props.utterances.filter(item => item !== object);
		props.setUtterances(arr);
		setActive(null);
		props.setStateChange(!props.stateChange)
	}


	const handleNew = () => {
		if (props.utterances[0].model.length > 0) {

			let newUtteranceField = { raw: '', model: [] };
			let arr = [newUtteranceField, ...props.utterances];

			props.setUtterances(arr);
			props.setStateChange(!props.stateChange);
		}

		setTimeout(() => {
			let input = document.querySelectorAll('.taggable-text__input')[0];
			input && input.focus();
		}, 100);
	}

	if (props.utterances) {
		return (
			<ul>
				{props.utterances.map((item, index) => {
					return (
						<li key={index} style={{ display: item.raw.toLowerCase().includes(props.searchPhrase) ? 'block' : 'none' }}>
							<Utterance key={index} utterances={props.utterances} utterance={item} index={index} active={active} setActive={setActive} entities={props.entities} removeFromUtterances={removeFromUtterances} utterances={props.utterances} setUtterances={props.setUtterances} stateChange={props.stateChange} setStateChange={props.setStateChange} slotValuePairs={props.slotValuePairs} handleNew={handleNew} />
						</li>
					)
				})}
			</ul>
		)
	} else {
		return null
	}
}

export default React.memo(IntentUtterances);
