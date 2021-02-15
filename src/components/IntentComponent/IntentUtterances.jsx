import React, { useState } from 'react'
import { Utterance } from './utterance/Utterance.jsx'

const List = React.memo(function List(props) {
	const [active, setActive] = useState(null)

	const removeFromUtterances = (index) => {
		let arr = [...props.utterances]
		if (index !== -1) {
			arr.splice(index, 1)
			console.log('new arr after delete', arr)
			props.setUtterances(arr)
			props.setActive(null)
		}
	}

	if (props.utterances) {
		return (
			<ul>
				{props.utterances.map((item, index) => {
					return (
						<Utterance key={index} data={item} index={index} active={active} setActive={setActive} entities={props.entities} />
					)
				})}
			</ul>
		)
	} else {
		return null
	}
})

export { List }
