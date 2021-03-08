import React, { useState } from 'react'
import { Utterance } from './utterance/Utterance.jsx'

const List = (props) => {
	const [active, setActive] = useState(null)

	const removeFromUtterances = (object) => {
		let arr = props.utterances.filter(item => item !== object);
		props.setUtterances(arr);
		setActive(null);
	}

	if (props.utterances) {
		return (
			<ul>
				{props.utterances.map((item, index) => {
					return (
						<Utterance key={index} data={item} index={index} active={active} setActive={setActive} entities={props.entities} removeFromUtterances={removeFromUtterances} utterances={props.utterances} setUtterances={props.setUtterances} />
					)
				})}
			</ul>
		)
	} else {
		return null
	}
}

export { List }
