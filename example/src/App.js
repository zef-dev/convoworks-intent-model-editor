import React, {useState} from 'react'

import { IntentEditor } from 'convoworks-intent-model-editor'
import { EntitiyEditor } from 'convoworks-intent-model-editor'
// import 'convoworks-intent-model-editor/dist/index.css'
import data from './guess-the-number-game.json'

const App = () => {
  const [view, setView] = useState('intent');
  return (
    <React.Fragment>
      <nav>
        <button onClick={() => setView('intent')}>Intent editor</button>
        <button onClick={() => setView('entity')}>Entity editor</button>
      </nav>
      {view === 'intent' ? 
      <IntentEditor
        intent={data.intents[0]}
        entities={data.entities}
        systemEntities={[]}
        onUpdate={() => {console.log('update')}}
      />

      :

      <EntitiyEditor
        entity={data.entities[0]}
        onUpdate={() => {console.log('update')}}
      />
    }
    </React.Fragment>
  )
}

export default App
