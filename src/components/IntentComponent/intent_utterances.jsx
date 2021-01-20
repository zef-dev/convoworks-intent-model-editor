import React, { useState, useEffect } from 'react';
import { stringToColor } from '../../helpers/common_constants.jsx';
import { Modal } from './intent_modal.jsx';
import Utterance from './utterance/utterance.jsx';

const List = React.memo(function List(props) {
	const [ modal, setModal ] = useState(false);
	const [ selection, setSelection ] = useState(null);
	const [ update, setUpdate ] = useState(false);
	const [ stateChange, setStateChange ] = useState(false);
	const [ paramValues, setParamValues ] = useState(null);
	const intents = props.intents;

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

	const mapNodesToModel = (items, index) => {
		let arr = Array.from(items).filter((item) => item.textContent.trim().length);

		let i = 0;
		arr = arr.map((item) => {
			if (item.tagName === 'SPAN' || (item.nodeName === '#text' && item.textContent.trim().length)) {
				let type = item.dataset && item.dataset.type && item.dataset.type.length ? item.dataset.type : null;
				if (type) {
					i++;
					return {
						text: item.textContent.trim(),
						type: type,
						slot_value: item.dataset.slotValue
					};
				} else {
					return { text: item.textContent.trim() };
				}
			} else {
				return null;
			}
		});

		arr = arr.filter((item) => item);

		let values = [ ...props.utterances ];
		values[index] = { raw: arr.map((item) => item.text).join(' '), model: arr };
		props.setUtterances(values);
	};

	const makeItems = (items) => {
		return items.map((item, index) => {
			let model = item.model.map((val) => {
				return { ...val, color: stringToColor(val.text) };
			});

			let data = {
				index: index,
				active: index === props.active,
				model: model,
				utterances: props.utterances,
				setUtterances: props.setUtterances,
				handleActive: handleActive,
				modal: modal,
				setModal: setModal,
				selection: selection,
				setSelection: setSelection,
				addNewValue: props.addNewValue,
				stateChange: stateChange,
				setStateChange: setStateChange,
				removeFromUtterances: removeFromUtterances,
				removeFromModel: props.removeFromModel,
				mapNodesToModel: mapNodesToModel,
				focusOnExpressionInput: props.focusOnExpressionInput,
			};

			return <Utterance key={index} data={data} errors={props.errors} />;
		});
	};

	const removeFromUtterances = (index) => {
		let arr = [ ...props.utterances ];
		if (index !== -1) {
			arr.splice(index, 1);
			props.setUtterances(arr);
			props.setActive(null);
		}
	};

	if (props.utterances) {
		return (
			<React.Fragment>
				<ul>{makeItems(props.utterances)}</ul>
				<Modal
					setModal={setModal}
					modal={modal}
					selection={selection}
					setSelection={setSelection}
					active={props.active}
					utterances={props.utterances}
					setUtterances={props.setUtterances}
					setUpdate={setUpdate}
					update={update}
					mapNodesToModel={mapNodesToModel}
					stateChange={stateChange}
					setStateChange={setStateChange}
					entities={props.entities.flat()}
					paramValues={paramValues}
					setParamValues={setParamValues}
				/>
			</React.Fragment>
		);
	} else {
		return null;
	}
});

export { List };
