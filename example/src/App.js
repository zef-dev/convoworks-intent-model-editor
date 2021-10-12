import React, {useState, useEffect} from 'react'

import { IntentEditor, EntityEditor } from '@zef-dev/convoworks-intent-model-editor'
import '@zef-dev/convoworks-intent-model-editor/dist/index.css'
import data from './guess-the-number-game.json'

const App = () => {
  const [view, setView] = useState('intent');
  const [intent, setIntent] = useState(null);


  useEffect(() => {
    setIntent(data.intents[1])
  }, [data])

  if (intent) {
    return (
      <React.Fragment>
          <nav>
            <button onClick={() => setView('intent')}>Intent editor</button>
            <button onClick={() => setView('entity')}>Entity editor</button>
          </nav>
          {view === 'intent' ? 
          <IntentEditor
            intent={intent}
            intents={data.intents}
            entities={[...data.entities, {name: 'test.entity.someVal', values: []}, {name: 'test.entity.more.dots', values: []}]}
            systemEntities={[]}
            onUpdate={(item, valid) => {console.log(item, valid)}}
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
