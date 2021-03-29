import React, { useState, useEffect } from 'react'
import { Utterance } from './utterance/Utterance.jsx'

const IntentUtterances = (props) => {
	const [active, setActive] = useState(0);

	const removeFromUtterances = (object) => {
		let arr = props.utterances.filter(item => item !== object);
		props.setUtterances(arr);
		setActive(null);
		props.setStateChange(!props.stateChange)
	}

	useEffect(() => {
		if (props.utterances[0].model.filter(item => item.type).length > 0) {
			props.setUtterances([{raw: '', model: [], new: true}, ...props.utterances]);
			props.setStateChange(!props.stateChange);
		}
	}, [props.utterances])

	if (props.utterances) {
		return (
			<ul>
				{props.utterances.map((item, index) => {
					let isNew = index === 0;
					return (
						<li style={{display: item.raw.toLowerCase().includes(props.searchPhrase) ? 'block' : 'none'}}>
							<Utterance key={index} utterance={item} new={isNew} index={index} active={active} setActive={setActive} entities={props.entities} removeFromUtterances={removeFromUtterances} utterances={props.utterances} setUtterances={props.setUtterances} stateChange={props.stateChange} setStateChange={props.setStateChange} />
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
