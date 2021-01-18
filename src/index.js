import React from 'react'
import EntityDetails from './components/EntityComponent/EntityDetails'
import IntentDetails from './components/IntentComponent/IntentDetails'
import './styles.scss'

export const IntentEditor = (props) => {
  return <IntentDetails intent={props.intent} entities={props.entities} systemEntities={props.systemEntities} onUpdate={props.onUpdate} />
}

export const EntityEditor = (props) => {
  return <EntityDetails entity={props.entity} onUpdate={props.onUpdate} />
}