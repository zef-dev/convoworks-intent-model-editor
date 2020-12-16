import React from 'react'
import EntityDetails from './components/EntityComponent/entity_details'
import IntentDetails from './components/IntentComponent/intent_details'
import './styles.scss'

export const IntentEditor = (props) => {
  return <IntentDetails intent={props.intent} entities={props.entities} systemEntities={props.systemEntities} onUpdate={props.onUpdate} />
}

export const EntityEditor = (props) => {
  return <EntityDetails entity={props.entity} onUpdate={props.onUpdate} />
}