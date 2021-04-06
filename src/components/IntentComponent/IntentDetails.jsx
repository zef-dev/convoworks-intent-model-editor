import React, { useState, useEffect, useCallback } from 'react';
import IntentUtterances from './IntentUtterances.jsx';
import _, { debounce } from 'lodash';
import { useRef } from 'react';
import { validateInput } from '../../helpers/validations.jsx';
import useDebounce from '../../helpers/useDebounce.jsx';

function IntentDetails(props) {
  const [intent, setIntent] = useState(props.intent);
  const [savedIntent, setSavedIntent] = useState(props.intent);
  const entities = props.entities;
  const systemEntities = props.systemEntities;
  const [stateChange, setStateChange] = useState(false);

  const [name, setName] = useState('');
  const [utterances, setUtterances] = useState([]);
  const [newExpression, setNewExpression] = useState(null);

  const [valid, setValid] = useState(true);
  const [searchPhrase, setSearchPhrase] = useState('');

  const newExpressionInput = useRef(null);

  const searchInput = useRef(null);

  // check if data is passed in props
  useEffect(() => {
    if (intent) {
      setName(intent.name);
      setUtterances(intent.utterances);
    }
  }, [intent]);
  
  const handleNew = () => {
    let newUtteranceField = { raw: '', model: [] };
    if (utterances[0] && utterances[0].model.length > 0) {
      let arr = [newUtteranceField, ...utterances];
      setUtterances(arr);
      setStateChange(!stateChange);

      let input = document.querySelectorAll('.taggable-text__input')[1];

      input && input.focus();
    }
  }

  const debouncedHandleNew = useDebounce(handleNew, 500);

  useEffect(() => {
    debouncedHandleNew;
  }, [utterances])


  useEffect(() => {
    if (name && utterances) {

      let intent = {
        ...intent,
        name: name,
        utterances: utterances
      }


      props.onUpdate(intent);
    }
  }, [name, utterances]);

  const handleSearch = () => {
    if (searchInput.current) {
      let term = searchInput.current.value.toLowerCase().trim();
      setSearchPhrase(term);
    }
  }

  if (utterances.length) {
    return (
      <div className="convo-details">
        <section className="layout--editor-content">
          <div>
            {/* Entity name value */}
            <div className="margin--30--large">
              <h3 className="margin--10--large">Intent name</h3>
              <form
                onSubmit={e => {
                  e.preventDefault();
                }}
              >
                <input
                  type="text"
                  defaultValue={name ? name : ''}
                  placeholder="Intent name"
                  className="editor-input input--item-name"
                  onChange={e => {
                    let message =
                      'Intent names shall begin with alphabetic characters from a to Z. The intent name may contain 1 underscore per word. Intent names shall not contain any numbers at all.';
                    validateInput(
                      e.target,
                      e.target.value,
                      '^[A-Za-z](_?[A-Za-z])*_?$',
                      message
                    );
                    setName(e.target.value);
                  }}
                  required
                />
              </form>
            </div>
            {/* Entity words */}
            <div className="margin--50--large">
              <div className="search-wrapper">
                <h3>Utterances</h3>
                <input ref={searchInput} className="editor-input input--search" type="text" placeholder="Search utterances" onChange={(e) => {
                  handleSearch();
                }} />
              </div>
              <div className="margin--24--large">
                <IntentUtterances
                  utterances={utterances}
                  setUtterances={setUtterances}
                  entities={[entities, ...systemEntities]}
                  stateChange={stateChange}
                  setStateChange={setStateChange}
                  searchPhrase={searchPhrase}
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
