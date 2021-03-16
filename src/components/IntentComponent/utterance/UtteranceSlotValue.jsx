import React from 'react';

const UtteranceSlotValue = React.memo((props) => {
  return (
    <input defaultValue={props.slotValue} onChange={(e) => {

    }} />
  )
})

export default UtteranceSlotValue;