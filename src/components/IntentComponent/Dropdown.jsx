import React, { useState, useEffect, useRef } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';

function Dropdown(props) {
	const [entities, setEntities] = useState(props.entities);
	const [allEntities, setAllEntities] = useState(props.entities);
	const [entitiesNames, setEntitiesNames] = useState([]);
	const input = useRef();

	const modalRef = useOnclickOutside(() => {
		props.setSelection(null);
	});

	const filterEntities = (term) => {
		let arr = [...allEntities];
		let filteredArr = arr.filter(
			(item) => item.name && item.name.toLowerCase().includes(term.trim().toLowerCase())
		);

		setEntities(filteredArr);
	};

	useEffect(
		() => {
			let arr = entities
				.map((item) => {
					return item.name;
				})
				.filter((item) => item);
			//console.log(arr)
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
			<div class="dropdown" ref={modalRef} style={dropdownStyles} onMouseDown={e => {console.log(e); e.preventDefault()}}>
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
					<div class="dropdown__selection">Selection: <strong>{props.selection}</strong></div>
				</header>
				<div class="dropdown__items">
					{entities[0] && entities[0].map((item, i) => {
						return (
							<button
								key={i}
								onClick={() => {
									props.tagSelection(item.name, item.name)
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
