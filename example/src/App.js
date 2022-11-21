import React, {useState, useEffect} from 'react'

import { IntentEditor, EntityEditor } from '@zef-dev/convoworks-intent-model-editor'
import '@zef-dev/convoworks-intent-model-editor/dist/index.css'
import data from './guess-the-number-game.json'

const App = () => {
  const [view, setView] = useState('intent');
  const [intent, setIntent] = useState(null);
  const [valid, setValid] = useState(false);

  const validator = ( str) => {
    let reg = /^[a-zA-Z][a-zA-Z/\s/./_/'/-]*$/;
    let valid = reg.test( str.trim());
    if ( !valid) {
        return {
            valid : false,
            message : "Error: Utterance can't contain special characters when working with Amazon Alexa"
        };   
    }
    
    if ( str === 'PERO') {
        console.log( str);
        return {
            valid : true,
            message : "Warinign: PERO is here!"
        };    
    }    
    return {
        valid : true,
        message : ""
    };
};
  useEffect(() => {
    setIntent(data.intents[0])
  }, [data])

  useEffect(() => {
    console.log(valid, 'is valid')
  }, [valid])
  
  if (intent) {
    return (
      <React.Fragment>
          <nav>
            <button onClick={() => setView('intent')}>Intent editor</button>
            <button onClick={() => setView('entity')}>Entity editor</button>
            <button disabled={!valid}>Save</button>
          </nav>
          {view === 'intent' ? 
          <IntentEditor
            validator={validator}
            intent={intent}
            intents={data.intents}
            entities={[...data.entities, {name: 'test.entity.someVal', values: []}, {name: 'test.entity.more.dots', values: []}]}
            systemEntities={[]}
            onUpdate={(item, valid) => {setValid(valid)}}
          />
    
          :
    
          <EntityEditor
            entity={data.entities[0]}
            onUpdate={() => {console.log('update')}}
          />
        }
      </React.Fragment>
    )
  } else {
    return null
  }
}

export default App
