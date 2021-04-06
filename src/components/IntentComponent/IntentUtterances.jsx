import React, { useState, useEffect, useRef } from 'react'
import { Utterance } from './utterance/Utterance.jsx'

const IntentUtterances = (props) => {

	console.log(props.utterances)
	const [active, setActive] = useState(null);
	const removeFromUtterances = (object) => {
		let arr = props.utterances.filter(item => item !== object);
		props.setUtterances(arr);
		setActive(null);
		props.setStateChange(!props.stateChange)
	}

	if (props.utterances) {
		return (
			<ul>
				{props.utterances.map((item, index) => {
					return (
						<li style={{ display: item.raw.toLowerCase().includes(props.searchPhrase) ? 'block' : 'none' }}>
							<Utterance key={index} utterance={item} new={item.new} index={index} active={active} setActive={setActive} entities={props.entities} removeFromUtterances={removeFromUtterances} utterances={props.utterances} setUtterances={props.setUtterances} stateChange={props.stateChange} setStateChange={props.setStateChange} />
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
