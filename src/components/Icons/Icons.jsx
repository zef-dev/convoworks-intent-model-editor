import React from 'react';
import { ReactSVG } from 'react-svg';
import { iconTrash } from '../../helpers/image_paths';


export const IconTrash = () => {
  return <img src={iconTrash} alt="Remove" aria-label="Remove" width="32" />
}

export const  IconRemove = () => {
	return <span role="img" aria-label="Remove">&#x274C;</span>;
}

export const  IconSearch = () => {
  return <ReactSVG src={search} />
}
