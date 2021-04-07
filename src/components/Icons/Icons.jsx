import React from 'react';
import { ReactSVG } from 'react-svg';

import trash from '/../../assets/icons/trash.svg';
import search from '/../../assets/icons/search.svg';

export const IconTrash = () => {
  return <img src={trash} />
}

export const  IconRemove = () => {
	return <span role="img" aria-label="Remove">&#x274C;</span>;
}

export const  IconSearch = () => {
  return <ReactSVG src={search} />
}
