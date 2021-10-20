import React, { useEffect, useState, useRef } from 'react';
import { preventSubmit } from '../../../helpers/common_constants';

const UtteranceSlotValue = React.memo((props) => {
  const input = useRef(input);
  const [valid, setValid] = useState(true);

  const validateSlotValue = () => {
    let reg = /^[A-Za-z](_*[A-Za-z])*_*$/
    let regTest = reg.test(props.target.dataset.slotValue);
    input.current.setCustomValidity(regTest ? '' : 'Parameter name must not contain spaces or special characters');
    setValid(regTest);

  }

  useEffect(() => {
    validateSlotValue();
  }, [props])

  return (
    <input
      ref={input}
      data-valid={valid}
      value={props.slotValue}
      onKeyDown={(e) => preventSubmit(e)}
      onChange={(e) => {
        props.target.dataset.slotValue = e.target.value;
        props.updateRaw();
      }} />

  )
})

export default UtteranceSlotValue;