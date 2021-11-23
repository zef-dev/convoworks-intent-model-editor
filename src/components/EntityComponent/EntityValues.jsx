import React, { useState, useEffect } from 'react';
import EntityValue from './EntityValue.jsx';

function EntityValues(props) {
  const [activeValue, setActiveValue] = useState(null);

  function handleUpdate(arr, index, item) {
    arr[index] = {
      value: item.value,
      synonyms: item.synonyms
    };

    props.setValues(arr);
  }

  if (props.values) {
    return (
      <div>
        {props.values.map((value, index) => {
          return (
            <EntityValue
              key={`${value.value}_${index}`}
              index={index}
              item={value}
              values={props.values}
              removeValue={props.removeValue}
              handleUpdate={handleUpdate}
              activeValue={activeValue}
              setActiveValue={setActiveValue}
            />
          );
        })}
      </div>
    )
  } else {
    return null
  }
}

export default EntityValues;
