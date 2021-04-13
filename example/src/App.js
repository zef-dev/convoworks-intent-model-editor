import React, {useState, useEffect} from 'react'

import { IntentEditor } from 'convoworks-intent-model-editor'
import { EntityEditor } from 'convoworks-intent-model-editor'
import 'convoworks-intent-model-editor/dist/index.css'
import data from './guess-the-number-game.json'

const App = () => {
  const [view, setView] = useState('intent');
  const [intent, setIntent] = useState(null);

  const saveIntent = (item) => {
    localStorage.setItem('intent', JSON.stringify(item));
  }

  useEffect(() => {
    setIntent({name: '', utterances: []})
  }, [data])

  useEffect(() => {
    saveIntent(intent);
  }, [intent])

  return (
    <React.Fragment>
        <nav>
          <button onClick={() => setView('intent')}>Intent editor</button>
          <button onClick={() => setView('entity')}>Entity editor</button>
        </nav>
        {view === 'intent' ? 
        <IntentEditor
          intent={JSON.parse(localStorage.getItem('intent'))}
          entities={[...data.entities, {name: 'test.entity.someVal', values: []}, {name: 'test.entity.more.dots', values: []}]}
          systemEntities={[]}
          onUpdate={(item, valid) => {saveIntent(item);}}
        />
  
        :
  
        <EntityEditor
          entity={data.entities[0]}
          onUpdate={() => {console.log('update')}}
        />
      }
    </React.Fragment>
  )
}

export default App
