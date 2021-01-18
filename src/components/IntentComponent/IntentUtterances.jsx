import React, { useState, useEffect } from 'react';
import { getColor } from '../../helpers/common_constants.jsx';
import { Modal } from './IntentModal.jsx';
import Utterance from './utterance/Utterance.jsx';

const List = React.memo(function List(props) {
	const [ modal, setModal ] = useState(false);
	const [ modalPosition, setModalPosition ] = useState(null);
	const [ selection, setSelection ] = useState(null);
	const [ update, setUpdate ] = useState(false);
	const [ paramValues, setParamValues ] = useState(null);

	useEffect(
		() => {
			// get every item type & slot value pair from utterances array
			let arr = props.utterances
				.map((item) => item.model)
				.flat()
				.filter((item) => item.slot_value)
				.map((item) => ({ type: item.type, slot_value: item.slot_value }));


			// remove duplicate pairs 
			let uniq = arr.filter((v, i, a) => a.findIndex((t) => t.slot_value === v.slot_value) === i);
			setParamValues(uniq);
		},
		[ props.utterances ]
	);

	const handleActive = (index) => {
		props.setActive(index);
	};

	const makeItems = (items) => {
		return items.map((item, index) => {
			return <Utterance key={index} data={item} />;
		});
	};

	const removeFromUtterances = (index) => {
		let arr = [ ...props.utterances ];
		if (index !== -1) {
			arr.splice(index, 1);
			console.log('new arr after delete', arr);
			props.setUtterances(arr);
			props.setActive(null);
		}
	};

	console.log(selection);

	if (props.utterances) {
		return (
			<React.Fragment>
				<ul>{makeItems(props.utterances)}</ul>
				{/* <Modal
					setModal={setModal}
					modal={modal}
					modalPosition={modalPosition}
					selection={selection}
					setSelection={setSelection}
					active={props.active}
					utterances={props.utterances}
					setUtterances={props.setUtterances}
					setUpdate={setUpdate}
					update={update}
					stateChange={stateChange}
					setStateChange={setStateChange}
					entities={props.entities.flat()}
					paramValues={paramValues}
					setParamValues={setParamValues}
				/> */}
			</React.Fragment>
		);
	} else {
		return null;
	}
});

export { List };
