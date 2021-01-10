import React, { useState, useRef, useEffect } from 'react';
import { IconTrash } from '../../../assets/icon_trash.jsx';
import Input from './input.jsx';
import { Component } from 'react';
import _ from 'lodash';

const Utterance = (props) => {
	const [remove, setRemove] = useState(false);
	const [valid, setValid] = useState(true);

	const wrapper = useRef(null);
	const removeBtn = useRef(null);

	let data = props.data;

	useEffect(() => {
		let slotValues = props.data.model.map(item => item.slot_value).filter(item => item);
		let invalidValues = slotValues.filter(item => !item.match(/^[A-Za-z](_*[A-Za-z/"/'/`/`/])*_*$/));


		let term = props.data.model.filter(item => !item.type).map(item => item.text).join(' ');
		let types = props.data.model.filter(item => item.type);
		let reg = /^[a-zA-Z][a-zA-Z/"/'/`/\s]*$/;

		console.log(types, term.length)

		if ((reg.test(term) && !invalidValues.length) || types.length && !term.length) {
			setValid(true);
		} else {
			setValid(false);
		}
	}, [props.data.model]);

	return (
		<li
			data-valid={`${valid}`}
			ref={wrapper}
			key={data.index}
			className={`field field--intent ${data.active ? 'field--active' : ''} ${remove
				? 'field--remove'
				: ''} ${valid ? 'field--valid' : 'field--error'}`}
			onClick={() => {
				data.handleActive(data.index);
			}}
		>
			{!valid && <legend className="field__error">Utterances shall begin with alphabetic characters from a to Z. The untterance may not contain other characters then alphabetic characters. The utterance shall not contain any numbers at all.</legend>}
			<div className="field__main">
				<Input
					model={data.model}
					index={data.index}
					utterances={data.utterances}
					setUtterances={data.setUtterances}
					modal={data.modal}
					setModal={data.setModal}
					setSelection={data.setSelection}
					selection={data.selection}
					mapNodesToModel={data.mapNodesToModel}
					active={data.active}
					addNewValue={data.addNewValue}
					stateChange={data.stateChange}
					focusOnExpressionInput={data.focusOnExpressionInput}
					wrapper={wrapper}
				/>
				<div className="field__actions">
					<button
						className="btn--remove btn--remove--main"
						type="button"
						ref={removeBtn}
						onClick={(e) => {
							e.stopPropagation();
							setRemove(true)
							setTimeout(() => {
								data.removeFromUtterances(data.index);
								setRemove(false);
							}, 220);
						}}
					>
						<IconTrash />
					</button>
				</div>
			</div>
			{data.model && data.model.filter((item) => item.type).length ? (
				<ul className="model" style={{display: `${data.active ? 'block' : 'none'}`}}>
					<header>
						<div>Parameter Name</div>
						<div>Entity</div>
						<div>Resolved Value</div>
					</header>
					{data.model.map((item, i) => {
						if (item.type) {
							let slotValue = item.slot_value;
							let type = item.type;
							return (
								<li key={i}>
									<input
										className="editor-input"
										type="text"
										defaultValue={slotValue}
										onChange={(e) => {
											let arr = [...data.utterances];
											arr[data.index].model[i].slot_value = e.target.value;
											data.setUtterances(arr);
										}}
										placeholder="Set parameter name"
									/>
									<div>
										<span className="highlight" style={{ background: item.color }}>
											{type}
										</span>
									</div>
									<div>{item.text}</div>
									<div className="field__actions">
										<button
											className="btn--remove"
											onClick={(e) => {
												e.preventDefault(e);
												data.removeFromModel(data.index, i);
												data.setStateChange(!data.stateChange);
											}}
										>
											<IconTrash />
										</button>
									</div>
								</li>
							);
						}
					})}
				</ul>
			) : (
					<React.Fragment />
				)}
		</li>
	);
}

export default Utterance;
