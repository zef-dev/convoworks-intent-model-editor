import React, { useState, useEffect, useRef } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';

function Dropdown(props) {
	const [term, setTerm] = useState('');
	const [entities, setEntities] = useState(props.entities);
	const [allEntities, setAllEntities] = useState(props.entities);
	const [entitiesNames, setEntitiesNames] = useState([]);
	const input = useRef();

	const modalRef = useOnclickOutside(() => {
		props.setSelection(null);
	});

	const filterEntities = (str) => {
		setTerm(str);
	};

	useEffect(
		() => {
			let arr = entities.flat()
				.map((item) => {
					return item.name;
				})
				.filter((item) => item);
			setEntitiesNames(arr);
		},
		[entities]
	);

	if (entities) {

		let dropdownStyles = {
			position: 'absolute',
			top: '100%',
			transition: 'all 220ms ease-in-out',
			visibility: props.dropdownState.active ? 'visible' : 'hidden',
			opacity: props.dropdownState.active ? '1' : '0',
			left: props.dropdownState.position
		}

		return (
			<div class="dropdown" ref={modalRef} style={dropdownStyles}>
				<header className="dropdown__header">
					<TextInput
						Component="input"
						trigger=""
						options={entitiesNames}
						spaceRemovers={[]}
						matchAny={true}
						onChange={(e) => {
							filterEntities(e);
						}}
						ref={input}
						className="dropdown__search editor-input"
						placeholder="Filter entities"
					/>
					<div class="dropdown__selection">Selection: <strong>{props.selection && props.selection.toString()}</strong></div>
				</header>
				<div class="dropdown__items">
					{entities.length && entities.flat().map((item, i) => {
						return (
							<button
								style={{display: item.name.toLowerCase().includes(term.toLocaleLowerCase().trim()) ? 'block' : 'none'}}
								key={i}
								type="button"
								onClick={() => {
									props.tagSelection(item.name)
								}}
							>
								@
								{item.name}
							</button>
						);
					})}
				</div>
			</div>
		);
	} else {
		return null;
	}
}

export default Dropdown;
