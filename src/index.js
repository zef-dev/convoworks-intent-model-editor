import React from 'react'
import IntentDetails from './components/IntentComponent/intent_details'
import styles from './styles.module.css'

export const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

export const IntentEditor = (props) => {
  return <IntentDetails intent={''} entities={[]} systemEntities={[]} onUpdate={() => {console.log('update')}} />
}