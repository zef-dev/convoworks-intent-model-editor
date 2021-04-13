import React from 'react';
import { ReactSVG } from 'react-svg';

import trash from '/../../assets/icons/trash.png';
import search from '/../../assets/icons/search.svg';

export const IconTrash = () => {
  return <img src={trash} alt="Remove" aria-label="Remove" />
}

export const  IconRemove = () => {
	return <span role="img" aria-label="Remove">&#x274C;</span>;
}

export const  IconSearch = () => {
  return <ReactSVG src={search} />
}
