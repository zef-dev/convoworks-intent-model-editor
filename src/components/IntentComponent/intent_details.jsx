import React, { useState, useEffect } from 'react';
import { List as Utterances } from './intent_utterances.jsx';
import { useRef } from 'react';
import { validateInput } from '../../helpers/validations.jsx';
import { preventSubmit } from '../../helpers/common_constants.jsx';

function IntentDetails(props) {
  const [intent, setIntent] = useState(props.intent);
  const entities = props.entities;
  const systemEntities = props.systemEntities;

  const [name, setName] = useState('');
  const [utterances, setUtterances] = useState([]);
  const [active, setActive] = useState(null);
  const [newExpression, setNewExpression] = useState(null);
  const [nameValid, setNameValid] = useState(true);

  const newExpressionInput = useRef(null);

  let errors = Array.from(document.querySelectorAll('[data-valid="false"]'));


  const focusOnExpressionInput = () => {
    newExpressionInput.current.focus();
    newExpressionInput.current.value = '';
    setActive(null);
  };

  // add new value to value array
  function addNewValue() {
    let arr = [...utterances];
    let newUtterance = {
      raw: newExpression ? newExpression : '',
      model: [{ text: newExpression ? newExpression : '' }],
    };
    arr = [newUtterance, ...arr];
    setUtterances(arr);
    setActive(0);
  }

  const removeFromModel = (utteranceIndex, index) => {
    let arr = [...utterances];
    let model = arr[utteranceIndex].model;
    model[index] = {
      text: model[index].text,
    };

    setUtterances(arr);
  };

  // check if data is passed in props
  useEffect(() => {
    if (intent) {
      setName(intent.name);
      setUtterances(intent.utterances);
    }
  }, [intent]);

  useEffect(() => {

    console.log('errors --->', errors.length < 1)
    if (name && utterances) {
      props.onUpdate({
        ...intent,
        name: name,
        utterances: utterances,
      }, errors.length < 1);
    }
  }, [name, utterances]);

  if (intent) {
    return (
      <div className="convo-details">
        <section className="layout--editor-content">
          <div>
            {/* Entity name value */}
            <div className="margin--30--large">
              <h3 className="margin--10--large">Intent name</h3>

              <input
                data-valid={`${nameValid}`}
                type="text"
                defaultValue={name ? name : ''}
                placeholder="Intent name"
                className="editor-input input--item-name"
                onKeyDown={(e) => preventSubmit(e)}
                required
                onChange={e => {
                  let message =
                    'Intent names shall begin with alphabetic characters from a to Z. The intent name may contain 1 underscore per word. Intent names shall not contain any numbers at all.';
                  let valid = validateInput(
                    e.target,
                    e.target.value,
                    '^[A-Za-z](_?[A-Za-z])*_?$',
                    message
                  );

                  setNameValid(valid);
                  setName(e.target.value);
                }}
              />
            </div>
            {/* Entity words */}
            <div className="margin--50--large">
              <h3 className="margin--10--large">Utterances</h3>
              <div className="margin--24--large">
                <input
                  type="text"
                  className="editor-input input--add-field"
                  placeholder="Enter reference value"
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      if (newExpression) {
                        addNewValue();
                        setNewExpression(null);
                        newExpressionInput.current.value = '';
                      }
                    }
                    preventSubmit(e)
                  }}
                  onChange={e => setNewExpression(e.target.value)}
                  ref={newExpressionInput}
                  onFocus={() => {
                    setActive(null);
                  }}
                />
                <Utterances
                  addNewValue={addNewValue}
                  active={active}
                  setActive={setActive}
                  utterances={utterances}
                  setUtterances={setUtterances}
                  removeFromModel={removeFromModel}
                  entities={[entities, ...systemEntities]}
                  focusOnExpressionInput={focusOnExpressionInput}
                  errors={errors}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } else {
    return null;
  }
}

export default IntentDetails;
