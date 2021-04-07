import React, { useState, useRef, useEffect } from 'react';
import { IconTrash } from '../../assets/icon_trash.jsx';
import { preventSubmit } from '../../helpers/common_constants.jsx';

const EntityValue = (props) => {
	const [value, setValue] = useState(props.item.value);
	const [synonyms, setSynonyms] = useState(props.item.synonyms);
	const [newSynonym, setNewSynonym] = useState('');
	const [remove, setRemove] = useState(false);
	const synonymInput = useRef(null);

	let active = props.activeValue === props.index;

	useEffect(
		() => {
			props.handleUpdate([...props.values], props.index, {
				value: value,
				synonyms: synonyms
			});
		},
		[value, synonyms]
	);

	useEffect(
		() => {
			if (newSynonym) {
				if (synonyms) {
					setSynonyms([...synonyms, newSynonym]);
				} else {
					setSynonyms(newSynonym);
				}
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[newSynonym]
	);

	const handleNewSynonym = (target) => {
		if (target.current.value.length > 0) {
			setNewSynonym(target.current.value);
			target.current.value = '';
		} else {
			setNewSynonym('');
		}
	};

	// synonyms
	const removeSynonym = (value) => {
		let arr = [...synonyms];
		let index = arr.indexOf(value);

		if (index !== -1) {
			arr.splice(index, 1);
			setSynonyms(arr);
		}
	};

	const makeSynonyms = (items, isActive) => {
		if (items) {
			return (
				items &&
				items.map((item, i) => {
					if (item) {
						return (
							<div key={i} className="synonym">
								{item}
								{isActive &&
									<button
										type="button"
										className="synonym__remove"
										onClick={() => {
											removeSynonym(item);
										}}
									>
										&#10005;
									</button>
								}
							</div>)
					}
				})
			);
		}
	};

	const handleRemove = (e) => {
		e.stopPropagation();
		setRemove(true);
		setTimeout(() => {
			props.removeValue(props.index);
			setRemove(false);
		}, 220);
	};

	return (
		<li
			className={`field field--${active ? 'active' : 'inactive'} field--entity ${remove ? 'field--remove' : ''}`}
			onClick={() => {
				props.setActiveValue(props.index);
			}}
		>
			<div class="field__value">
				{active ?
					<input
						className="editor-input"
						type="text"
						defaultValue={value}
						placeholder="Enter value"
						onKeyDown={(e) => {
							//preventSubmit(e);
						}}
						onChange={(e) => {
							setValue(e.target.value);
						}}
					/>

					:

					<input
						readOnly
						className="editor-input"
						type="text"
						defaultValue={value}
						placeholder="Enter value"
						onKeyDown={(e) => {
							//preventSubmit(e);
						}}
						onChange={(e) => {
							setValue(e.target.value);
						}}
					/>
				}
			</div>
			<div className="field__synonyms">
				{makeSynonyms(synonyms, active)}
				<input
					className="editor-input"
					type="text"
					style={{ marginLeft: '0.625rem' }}
					onKeyDown={(e) => {
						if (e.keyCode == 13) {
							handleNewSynonym(synonymInput);
						}
						// preventSubmit(e);
					}}
					ref={synonymInput}
					placeholder="Enter synonym"
				/>
			</div>
			<div className="field__actions">
				<button
					className="btn--remove btn--remove--main"
					type="button"
					onClick={(e) => {
						handleRemove(e);
					}}
				>
					<IconTrash />
				</button>
			</div>
		</li>
	);
};

export default EntityValue;
