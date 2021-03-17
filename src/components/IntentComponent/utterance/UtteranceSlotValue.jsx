import React from 'react';

const UtteranceSlotValue = (props) => {

  return (
    <input defaultValue={props.slotValue} onChange={(e) => {
      props.target.dataset.slotValue = e.target.value;
    }} />
  )
}

export default UtteranceSlotValue;