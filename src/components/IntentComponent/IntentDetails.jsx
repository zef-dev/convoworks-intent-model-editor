import React, { useState, useEffect } from 'react';
import IntentUtterances from './IntentUtterances.jsx';
import _, { property } from 'lodash';
import { simpleValidateInput, validateInput } from '../../helpers/validations.jsx';

import { preventSubmit } from '../../helpers/common_constants.jsx';
import { iconSearch } from '../../helpers/image_paths.jsx';

function IntentDetails(props) {

  const [intent] = useState(props.intent);
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
        setUtterances([{ raw: '', model: [] }, ...intent.utterances.filter(item => item.model.length > 0)]);
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
      // TODO: using a timeout is really hacky -> do better
      setTimeout(() => {
        const valid = document.querySelectorAll('[data-field-valid="false"]').length < 1;
        let updatedIntent = {
          ...intent,
          name: name,
          utterances: utterances.filter(item => item.model.length),
          type: intent.type || 'custom'
        }

        props.onUpdate(updatedIntent, valid);
      }, 10)
    }
  }, [name, utterances]);

  const handleSearch = (term) => {
    setSearchPhrase(term);
  }

  const handleNameChange = (e) => {
    let message =
      'Intent names shall begin with alphabetic characters from a to Z. The intent name may contain 1 underscore per word. Intent names shall not contain any numbers at all.';
    let isTextValid = simpleValidateInput(e.target.value, '^[A-Za-z](_?[A-Za-z])*_?$');
    let doesSameIntentNameExist = props.intents.filter(item => (item.name === e.target.value) && item !== intent).length > 0;

    if (!isTextValid) {
      e.target.setCustomValidity(message);
    } else if (doesSameIntentNameExist) {
      e.target.setCustomValidity('Intent name must be unique')
    } else {
      e.target.setCustomValidity('');
    }

    e.target.reportValidity();
    setName(e.target.value);
  }

  const mapUtterancesAsString = (model) => {
    return model.map(item => {
      if (item.type) return `{${item.type}}`
      return item.text
    }).join(' ');
  }

  const mapUtterancesAsRawString = (model) => {
    return model.map(item => {
      return item.text
    }).join(' ');
  }

  if (intent && props.intents) { 

    const outsideIntentUtterances = !intent.parent_intent ? props.intents
      .filter(obj => obj.name !== intent.name && !obj.parent_intent)
      .map(intent => intent.utterances.map(
            utterance => ({ intent: intent.name, string: mapUtterancesAsString(utterance.model), stringRaw : mapUtterancesAsRawString( utterance.model) })))
      .flat()
      .filter(utterance => utterance.string !== "") : [];
    
    const currentIntentUtterances = utterances.map(
            utterance => ({ intent: intent.name, string: mapUtterancesAsString(utterance.model), stringRaw : mapUtterancesAsRawString( utterance.model) }))
      .filter(utterance => utterance.string !== "");
    
    const allUtterancesInIntents = [...outsideIntentUtterances, ...currentIntentUtterances];

    return (
      <div className="convo-details">
        <section className="layout--editor-content">
          <div>
            {/* Entity name value */}
            <hr />
            <div className="margin--30--large">
              <h3 className="margin--10--large">Intent name</h3>
              <input
                type="text"
                defaultValue={name ? name : ''}
                placeholder="Intent name"
                className="input input--item-name"
                onKeyDown={(e) => preventSubmit(e)}
                onChange={e => handleNameChange(e)}
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
                  validator={props.validator}
                  intents={props.intents}
                  allUtterancesInIntents={allUtterancesInIntents}
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
