import React, { useEffect, useState, useRef } from 'react';
import { preventSubmit } from '../../../helpers/common_constants';

const UtteranceSlotValue = React.memo((props) => {
  const [valid, setValid] = useState(true);

  const validateSlotValue = () => {
    let reg = /^[A-Za-z](_*[A-Za-z])*_*$/
    setValid(reg.test(props.target.dataset.slotValue))
  }

  useEffect(() => {
    validateSlotValue();
  }, [props])

  return (
    <input
      data-valid={valid}
      pattern="^[A-Za-z](_*[A-Za-z])*_*$"
      value={props.slotValue}
      onKeyDown={(e) => preventSubmit(e)}
      onChange={(e) => {
        props.target.dataset.slotValue = e.target.value;
        props.updateRaw();
      }} />

  )
})

export default UtteranceSlotValue;