import React, { useState, useEffect } from 'react';
import IntentUtterances from './IntentUtterances.jsx';
import _ from 'lodash';
import { useRef } from 'react';
import { validateInput } from '../../helpers/validations.jsx';

import { preventSubmit } from '../../helpers/common_constants.jsx';
import { iconSearch } from '../../helpers/image_paths.jsx';

function IntentDetails(props) {
  const [intent, setIntent] = useState(props.intent);
  const entities = props.entities;
  const systemEntities = props.systemEntities;
  const [stateChange, setStateChange] = useState(false);

  const [name, setName] = useState('');
  const [utterances, setUtterances] = useState([]);

  const [slotValuePairs, setSlotValuePairs] = useState([]);

  const [searchPhrase, setSearchPhrase] = useState('');

  // check if data is passed in props
  useEffect(() => {
    if (intent) {
      setName(intent.name);
      if (intent.utterances.length) {
        /* add new field if only one utterance is present */
        if (intent.utterances[0]?.model.length > 0) {
          setUtterances([{raw: '', model: []}, ...intent.utterances]);
        } else {
          setUtterances(intent.utterances);
        }
      } else {
        setUtterances([{ raw: '', model: [] }])
      }
    }
  }, [intent]);

  const setInitialSlotValuePairs = () => {
    let arr = utterances.map(item => item.model).flat().filter(item => item.slot_value).map(item => ({
      type: item.type,
      slot_value: item.slot_value
    }));

    setSlotValuePairs(arr);
  }

  useEffect(() => {
    setInitialSlotValuePairs();
  }, [utterances]);


  useEffect(() => {
    if (name && utterances) {

      const valid = document.querySelectorAll('[data-field-valid="false"]').length < 1;

      let intent = {
        ...intent,
        name: name,
        utterances: utterances.filter(item => item.model.length)
      }
      
      props.onUpdate(intent, valid);
    }
  }, [name, utterances]);

  const handleSearch = (term) => {
    setSearchPhrase(term);
  }

  if (intent) {
    return (
      <div className="convo-details">
        <section className="layout--editor-content">
          <div>
            {/* Entity name value */}
            <div className="margin--30--large">
              <h3 className="margin--10--large">Intent name</h3>
              <input
                type="text"
                defaultValue={name ? name : ''}
                placeholder="Intent name"
                className="input input--item-name"
                onKeyDown={(e) => preventSubmit(e)}
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
              />
            </div>
            {/* Entity words */}
            <div className="margin--50--large">
              <div className="search-wrapper">
                <h3>Utterances</h3>
                <input
                  style={{ background: `url(${iconSearch}) no-repeat 12px center`, backgroundSize: '18px', paddingLeft: '42px' }}
                  className="input input--search"
                  type="text" placeholder="Search utterances"
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  onKeyDown={(e) => preventSubmit(e)}
                />
              </div>
              <div className="margin--24--large">
                <IntentUtterances
                  utterances={utterances}
                  setUtterances={setUtterances}
                  entities={[entities, ...systemEntities]}
                  stateChange={stateChange}
                  setStateChange={setStateChange}
                  searchPhrase={searchPhrase}
                  slotValuePairs={slotValuePairs}
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
