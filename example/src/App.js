import React, {useState} from 'react'

import { IntentEditor } from 'convoworks-intent-model-editor'
import { EntityEditor } from 'convoworks-intent-model-editor'
import 'convoworks-intent-model-editor/dist/index.css'
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
      <form onSubmit={(e) => {e.preventDefault(); console.log('submit')}}>
        <IntentEditor
          intent={data.intents[0]}
          entities={data.entities}
          systemEntities={[]}
          onUpdate={() => {console.log('update')}}
        />
      </form>

      :

      <form onSubmit={(e) => {e.preventDefault(); console.log('submit')}}>

      <EntityEditor
        entity={data.entities[0]}
        onUpdate={() => {console.log('update')}}
      />
      </form>
    }
    </React.Fragment>
  )
}

export default App
