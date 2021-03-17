import React, { useState } from 'react'
import { Utterance } from './utterance/Utterance.jsx'

const IntentUtterances = (props) => {
	const [active, setActive] = useState(0);

	console.log(active)

	const removeFromUtterances = (object) => {
		let arr = props.utterances.filter(item => item !== object);
		props.setUtterances(arr);
		setActive(null);
		props.setStateChange(!props.stateChange)
	}

	if (props.utterances) {
		return (
			<div>
				{props.utterances.map((item, index) => {
					return (
						<Utterance key={index} utterance={item} index={index} active={active} setActive={setActive} entities={props.entities} removeFromUtterances={removeFromUtterances} utterances={props.utterances} setUtterances={props.setUtterances} stateChange={props.stateChange} setStateChange={props.setStateChange} />
					)
				})}
			</div>
		)
	} else {
		return null
	}
}

export default IntentUtterances;
