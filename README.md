# convoworks-intent-model-editor

> Intent and entity editors for the Convoworks framework

[![NPM](https://img.shields.io/npm/v/@zef-dev/convoworks-intent-model-editor.svg)](https://www.npmjs.com/package/@zef-dev/convoworks-intent-model-editor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

### npm

```bash
npm install --save @zef-dev/convoworks-intent-model-editor
```

### yarn

```bash
yarn add @zef-dev/convoworks-intent-model-editor
```

## Usage

#### React example

```jsx
import React, { Component } from 'react'
import {
  IntentEditor,
  EntityEditor
} from '@zef-dev/convoworks-intent-model-editor'
import '@zef-dev/convoworks-intent-model-editor/dist/index.css'

class IntentExample extends Component {
  render() {
    return (
      <IntentEditor
        intent={{}} // object
        entities={[]} // array
        systemEntities={[]} // array
        onUpdate={fn} // function
      />
    )
  }
}

class EntityExample extends Component {
  render() {
    return (
      <EntityEditor
        entity={{}} // object
        onUpdate={fn} // function 
      />
    )
  }
}
```

## License

MIT © [zef-dev](https://github.com/zef-dev)
