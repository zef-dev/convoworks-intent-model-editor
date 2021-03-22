import React, { useEffect, useState } from 'react';

const UtteranceSlotValue = React.memo((props) => {

  const validateSlotValue = () => {
    let reg = /^[A-Za-z](_*[A-Za-z])*_*$/;
    return reg.test(slotValue);
  }

  return (
    <input data-valid={validateSlotValue ? 'true' : 'false'} defaultValue={props.slotValue} onChange={(e) => {
      props.target.dataset.slotValue = e.target.value;
      props.updateRaw();
    }} />

  )
})

export default UtteranceSlotValue;