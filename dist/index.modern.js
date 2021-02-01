import React, { useState, useRef, useEffect } from 'react';
import 'lodash';
import '@yaireo/tagify/dist/react.tagify';
import '@yaireo/tagify/src/tagify.scss';
import 'rangy';
import ContentEditable from 'react-contenteditable';
import useOnclickOutside from 'react-cool-onclickoutside';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';

function IconTrash() {
  return /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    "fill-rule": "evenodd",
    stroke: "#1A1A1A",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.4 6.5v7c0 1.105.835 2 1.867 2h7.466c1.032 0 1.867-.895 1.867-2v-7M1.467 3.5h13.066M6.133 3.5v-3h3.734v3M8 7.5v5M10.8 7.5v5M5.2 7.5v5"
  })));
}

const EntityValue = props => {
  const [value, setValue] = useState(props.item.value);
  const [synonyms, setSynonyms] = useState(props.item.synonyms);
  const [newSynonym, setNewSynonym] = useState('');
  const [remove, setRemove] = useState(false);
  const synonymInput = useRef(null);
  useEffect(() => {
    props.handleUpdate([...props.values], props.index, {
      value: value,
      synonyms: synonyms
    });
  }, [value, synonyms]);
  useEffect(() => {
    if (newSynonym) {
      if (synonyms) {
        setSynonyms([...synonyms, newSynonym]);
      } else {
        setSynonyms(newSynonym);
      }
    }
  }, [newSynonym]);

  const handleNewSynonym = target => {
    if (target.current.value.length > 0) {
      setNewSynonym(target.current.value);
      target.current.value = '';
    } else {
      setNewSynonym('');
    }
  };

  const removeSynonym = value => {
    let arr = [...synonyms];
    let index = arr.indexOf(value);

    if (index !== -1) {
      arr.splice(index, 1);
      setSynonyms(arr);
    }
  };

  const makeSynonyms = (items, active) => {
    if (items) {
      return items && items.map((item, i) => {
        if (item && !active) {
          return /*#__PURE__*/React.createElement("div", {
            className: "synonym",
            key: i
          }, item);
        } else {
          return /*#__PURE__*/React.createElement("div", {
            key: i,
            className: "synonym"
          }, item, /*#__PURE__*/React.createElement("button", {
            type: "button",
            className: "synonym__remove",
            onClick: () => {
              removeSynonym(item);
            }
          }, "\u2715"));
        }
      });
    }
  };

  const handleRemove = e => {
    e.stopPropagation();
    setRemove(true);
    setTimeout(() => {
      props.removeValue(props.index);
      setRemove(false);
    }, 220);
  };

  if (props.activeValue !== props.index) {
    return /*#__PURE__*/React.createElement("li", {
      className: `item item--entity ${remove ? 'item--remove' : ''}`,
      onClick: () => {
        props.setActiveValue(props.index);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "item__inner"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cell cell--3--small"
    }, /*#__PURE__*/React.createElement("div", {
      className: "item__value item__value--primary"
    }, value)), /*#__PURE__*/React.createElement("div", {
      className: "cell cell--9--small"
    }, /*#__PURE__*/React.createElement("div", {
      className: "item__values"
    }, makeSynonyms(synonyms, false))))), /*#__PURE__*/React.createElement("div", {
      className: "item__buttons"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn--remove btn--remove--main",
      type: "button",
      onClick: e => {
        handleRemove(e);
      }
    }, /*#__PURE__*/React.createElement(IconTrash, null))));
  } else {
    return /*#__PURE__*/React.createElement("li", {
      className: `item item--entity item--active ${remove ? 'item--remove' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "item__inner"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cell cell--3--small"
    }, /*#__PURE__*/React.createElement("div", {
      className: "item__value item__value--primary"
    }, /*#__PURE__*/React.createElement("input", {
      "data-input": "true",
      className: "editor-input",
      type: "text",
      defaultValue: value,
      placeholder: "Enter value",
      onChange: e => {
        setValue(e.target.value);
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "cell cell--9--small"
    }, /*#__PURE__*/React.createElement("div", {
      className: "item__values"
    }, makeSynonyms(synonyms, true), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
        handleNewSynonym(synonymInput);
      }
    }, /*#__PURE__*/React.createElement("input", {
      className: "editor-input",
      type: "text",
      style: {
        marginLeft: '0.625rem'
      },
      ref: synonymInput,
      placeholder: "Enter synonym",
      onChange: e => {}
    }), /*#__PURE__*/React.createElement("input", {
      className: "editor-input",
      type: "submit",
      hidden: true
    })))))), /*#__PURE__*/React.createElement("div", {
      className: "item__buttons"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn--remove btn--remove--main",
      type: "button",
      onClick: e => {
        handleRemove(e);
      }
    }, /*#__PURE__*/React.createElement(IconTrash, null))));
  }
};

function EntityValues(props) {
  const [activeValue, setActiveValue] = useState(null);

  function handleUpdate(arr, index, item) {
    arr[index] = {
      value: item.value,
      synonyms: item.synonyms
    };
    props.setValues(arr);
  }

  const makeItems = items => {
    if (items) {
      return items.map((item, index) => {
        return /*#__PURE__*/React.createElement(React.Fragment, {
          key: index
        }, /*#__PURE__*/React.createElement(EntityValue, {
          index: index,
          item: item,
          values: props.values,
          removeValue: props.removeValue,
          handleUpdate: handleUpdate,
          activeValue: activeValue,
          setActiveValue: setActiveValue
        }));
      });
    }
  };

  if (props.values) {
    return /*#__PURE__*/React.createElement("div", null, makeItems(props.values));
  } else {
    return null;
  }
}

const validateInput = (elem, term, regex, message) => {
  let reg = new RegExp(regex);

  if (reg.test(term)) {
    elem.setCustomValidity('');
  } else {
    elem.setCustomValidity(message);
  }

  elem.reportValidity();
  return reg.test(term);
};

function EntityDetails(props) {
  const [entity, setEntity] = useState(null);
  const [name, setName] = useState(null);
  const [values, setValues] = useState(null);
  const [newValue, setNewValue] = useState(null);
  const [valid, setValid] = useState(true);
  const valueInput = useRef(null);
  useEffect(() => {
    if (!entity) {
      setEntity(props.entity);
    }
  }, [props.entity]);
  useEffect(() => {
    setName(props.entity.name);
    setValues(props.entity.values);
  }, [entity]);
  useEffect(() => {
    if (name && values) {
      props.onUpdate({
        name: name,
        values: values
      }, valid);
    }
  }, [name, values]);

  const addNewValue = () => {
    let val = {
      value: newValue,
      synonyms: []
    };
    let arr = [...values, val];
    setValues(arr);
  };

  const removeValue = index => {
    let arr = [...values];

    if (index !== -1) {
      arr.splice(index, 1);
      setValues(arr);
    }
  };

  if (values) {
    return /*#__PURE__*/React.createElement("div", {
      className: "convo-details"
    }, /*#__PURE__*/React.createElement("section", {
      className: "layout--editor-content"
    }, /*#__PURE__*/React.createElement("section", {
      className: "entities-editor"
    }, /*#__PURE__*/React.createElement("div", {
      className: "margin--30--large"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "margin--10--large"
    }, "Entity name"), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      defaultValue: name ? name : '',
      placeholder: "Entity name",
      className: "editor-input input--item-name",
      onChange: e => {
        let message = 'Entity names shall begin with alphabetic characters from a to Z. The entity name may contain multiple underscores per word. Entity names shall not contain any numbers at all or soecial characters other than undersocres.';
        let validate = validateInput(e.target, e.target.value, '^[A-Za-z](_*[A-Za-z])*_*$', message);
        setValid(validate);
        setName(e.target.value);
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "margin--50--large"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "font--18--large margin--10--large"
    }, "Values"), /*#__PURE__*/React.createElement("div", {
      className: "margin--24--large"
    }, /*#__PURE__*/React.createElement(EntityValues, {
      values: values,
      setValues: setValues,
      removeValue: removeValue
    }), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();

        if (newValue) {
          addNewValue();
          setNewValue(null);
          valueInput.current.value = '';
        }
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "editor-input input--add-field",
      placeholder: "Enter reference value",
      onChange: e => setNewValue(e.target.value),
      ref: valueInput
    })))))));
  } else {
    return null;
  }
}

const stringToColor = value => {
  return value.getHashCode().intToHSL();
};

String.prototype.getHashCode = function () {
  var hash = 0;
  if (this.length == 0) return hash;

  for (var i = 0; i < this.length; i++) {
    hash = this.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  return hash;
};

Number.prototype.intToHSL = function () {
  var shortened = this % 220;
  return "hsl(" + shortened + ",100%, 75%)";
};

const getCaretCharacterOffsetWithin = element => {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;

  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();

    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }

  return caretOffset;
};
const setCaretPosition = (el, pos) => {
  for (var node of el.childNodes) {
    if (node.nodeType == 3) {
      if (node.length >= pos) {
        var range = document.createRange(),
            sel = window.getSelection();
        range.setStart(node, pos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return -1;
      } else {
        pos -= node.length;
      }
    } else {
      pos = setCaretPosition(node, pos);

      if (pos == -1) {
        return -1;
      }
    }
  }

  return pos;
};

function Dropdown(props) {
  const [entities, setEntities] = useState(props.entities);
  const [allEntities, setAllEntities] = useState(props.entities);
  const [entitiesNames, setEntitiesNames] = useState([]);
  const input = useRef();
  const modalRef = useOnclickOutside(() => {
    props.setSelection(null);
  });

  const filterEntities = term => {
    let arr = [...allEntities];
    let filteredArr = arr.filter(item => item.name && item.name.toLowerCase().includes(term.trim().toLowerCase()));
    setEntities(filteredArr);
  };

  useEffect(() => {
    let arr = entities.map(item => {
      return item.name;
    }).filter(item => item);
    setEntitiesNames(arr);
  }, [entities]);

  if (entities) {
    let dropdownStyles = {
      position: 'absolute',
      top: '100%',
      transition: 'all 220ms ease-in-out',
      visibility: props.dropdownState.active ? 'visible' : 'hidden',
      opacity: props.dropdownState.active ? '1' : '0',
      left: props.dropdownState.position
    };
    return /*#__PURE__*/React.createElement("div", {
      class: "dropdown",
      ref: modalRef,
      style: dropdownStyles
    }, /*#__PURE__*/React.createElement("header", {
      className: "dropdown__header"
    }, /*#__PURE__*/React.createElement(TextInput, {
      Component: "input",
      trigger: "",
      options: entitiesNames,
      spaceRemovers: [],
      matchAny: true,
      onChange: e => {
        filterEntities(e);
      },
      ref: input,
      className: "dropdown__search editor-input",
      placeholder: "Filter entities"
    }), /*#__PURE__*/React.createElement("div", {
      class: "dropdown__selection"
    }, "Selection: ", /*#__PURE__*/React.createElement("strong", null, props.selection))), /*#__PURE__*/React.createElement("div", {
      class: "dropdown__items"
    }, entities[0] && entities[0].map((item, i) => {
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => {
          props.tagSelection(item.name, item.name);
        }
      }, "@", item.name);
    })));
  } else {
    return null;
  }
}

function Utterance(props) {
  const [raw, setRaw] = useState('');
  const [state, setState] = useState(false);
  const [tagEditState, setTagEditState] = useState(false);
  const [dropdownState, setDropdownState] = useState({
    position: 0,
    active: false
  });
  const [inputText, setInputText] = useState(null);
  const [model, setModel] = useState(props.data.model);
  const [selection, setSelection] = useState(null);
  const [whitelist, setWhitelist] = useState(props.data.model.filter(item => item.type).map(item => ({
    text: item.text,
    type: item.type,
    slot_value: item.slot_value
  })));
  const input = useRef('');
  const text = useRef('');
  const inputWrapper = useRef('');
  const cursorPosition = useRef(0);
  useEffect(() => {
    input.current.innerHTML = props.data.raw.parseText();
    text.current = props.data.raw;
  }, []);

  String.prototype.parseText = function () {
    if (this.length) {
      let str = this.replace(/\s+/g, ' ').trim();
      let regex = new RegExp(whitelist.map(item => item.text.replace(/\s+/g, ' ').trim()).join('|'), 'gi\s');
      str = str.replace(regex, function (matched) {
        let isLastWord = str.lastIndexOf(matched) + matched.length === str.length;
        let matchedObject = whitelist.find(item => item.text === matched);
        return `<mark data-type="${matchedObject.type}" data-slot-value="${matchedObject.slot_value}" data-text="${matched}" style="background:${stringToColor(matched)}">${matched}</mark>${isLastWord ? ' ' : ''}`;
      });
      return str;
    }
  };

  const tagSelection = (type, slot_value) => {
    setTimeout(() => {
      let list = [...whitelist];
      let selectionPosition = {
        from: text.current.indexOf(selection),
        to: text.current.indexOf(selection) + selection.length
      };
      list.map((item, index) => {
        let itemPosition = {
          from: text.current.indexOf(item.text),
          to: text.current.indexOf(item.text) + item.text.length
        };

        switch (true) {
          case selectionPosition.from === itemPosition.from:
            list.splice(index, 1);

          case selectionPosition.to === itemPosition.to:
            list.splice(index, 1);

          case selectionPosition.from <= itemPosition.from && selectionPosition.to >= itemPosition.to:
            list.splice(index, 1);

          case selectionPosition.from >= itemPosition.from && selectionPosition.to <= itemPosition.to:
            list.splice(index, 1);

          case selectionPosition.from <= itemPosition.from && selectionPosition.to >= itemPosition.from:
            list.splice(index, 1);

          case selectionPosition.from >= itemPosition.from && selectionPosition.from <= itemPosition.to:
            list.splice(index, 1);

          case item.text === selection:
            list.splice(index, 1);
            break;
        }
      });
      list = [...list, {
        text: selection,
        type: type,
        slot_value: slot_value
      }];
      setWhitelist(list);
      setSelection(null);
    }, 0);
  };

  const handleSelection = () => {
    var sel;

    if (window.getSelection && (sel = window.getSelection()).modify) {
      sel = window.getSelection();

      if (!sel.isCollapsed) {
        var range = document.createRange();
        range.setStart(sel.anchorNode, sel.anchorOffset);
        range.setEnd(sel.focusNode, sel.focusOffset);
        var backwards = range.collapsed;
        range.detach();
        var endNode = sel.focusNode,
            endOffset = sel.focusOffset;
        sel.collapse(sel.anchorNode, sel.anchorOffset);
        var direction = [];

        if (backwards) {
          direction = ['backward', 'forward'];
        } else {
          direction = ['forward', 'backward'];
        }

        sel.modify('move', direction[0], 'character');
        sel.modify('move', direction[1], 'word');
        sel.extend(endNode, endOffset);
        sel.modify('extend', direction[1], 'character');
        sel.modify('extend', direction[0], 'word');
      }
    } else if ((sel = document.selection) && sel.type != 'Control') {
      var textRange = sel.createRange();

      if (textRange.text) {
        textRange.expand('word');

        while (/\s$/.test(textRange.text)) {
          textRange.moveEnd('character', -1);
        }

        textRange.select();
      }
    }

    if (sel.toString().length) {
      setSelection(sel.toString().trim());
    } else if (sel.toString.length === 0) {
      let mark = sel.focusNode.parentNode;

      if (mark.tagName === 'MARK') {
        setTagEditState(true);
        setSelection(mark.dataset.text);
      } else {
        setTagEditState(false);
        setSelection(null);
      }
    } else {
      setSelection(null);
    }

    cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
  };

  useEffect(() => {
    let s = window.getSelection();

    if (s && s.rangeCount > 0) {
      let oRange = s.getRangeAt(0);
      let oRect = oRange.getBoundingClientRect();
      setDropdownState({
        position: oRect.x,
        active: selection !== null
      });
    }
  }, [selection]);
  useEffect(() => {
    setCaretPosition(input.current, cursorPosition.current);
  }, [whitelist, tagEditState]);

  if (props.data && props.data.raw) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, "tag edit state: ", tagEditState.toString(), /*#__PURE__*/React.createElement("div", {
      class: `field field--intent ${props.active === props.index ? 'field--active' : ''}`,
      onClick: () => {
        props.setActive(props.index);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "field__main",
      id: "input"
    }, /*#__PURE__*/React.createElement("div", {
      className: "field__input"
    }, /*#__PURE__*/React.createElement("div", {
      class: "taggable-text",
      ref: inputWrapper
    }, /*#__PURE__*/React.createElement(ContentEditable, {
      innerRef: input,
      className: "taggable-text__input",
      html: text.current.parseText(),
      onChange: e => {
        text.current = e.currentTarget.textContent;
      },
      onMouseUp: e => {
        handleSelection();
      },
      onKeyDown: e => {
        if (tagEditState) {
          console.log(e);
        }

        if (e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38) {
          e.preventDefault();
        }
      },
      onKeyUp: e => {
        handleSelection();
      }
    }), "      "), /*#__PURE__*/React.createElement(Dropdown, {
      dropdownState: dropdownState,
      entities: props.entities,
      selection: selection,
      setSelection: setSelection,
      tagSelection: tagSelection
    }))), /*#__PURE__*/React.createElement("ul", {
      className: "model-list"
    }, /*#__PURE__*/React.createElement("header", {
      className: "model-list__header"
    }, /*#__PURE__*/React.createElement("strong", null, "Parameter name"), /*#__PURE__*/React.createElement("strong", null, "Entity"), /*#__PURE__*/React.createElement("strong", null, "Resolved value")), whitelist.map(item => {
      return /*#__PURE__*/React.createElement("li", {
        className: "model-list__item"
      }, /*#__PURE__*/React.createElement("div", null, item.slot_value.length ? item.slot_value : item.type), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("mark", {
        style: {
          background: stringToColor(item.text)
        }
      }, item.type)), /*#__PURE__*/React.createElement("div", null, item.text));
    }))));
  } else {
    return null;
  }
}

var Utterance$1 = React.memo(Utterance);

const List = React.memo(function List(props) {
  const [active, setActive] = useState(null);

  if (props.utterances) {
    return /*#__PURE__*/React.createElement("ul", null, props.utterances.map((item, index) => {
      return /*#__PURE__*/React.createElement(Utterance$1, {
        key: index,
        data: item,
        index: index,
        active: active,
        setActive: setActive,
        entities: props.entities
      });
    }));
  } else {
    return null;
  }
});

function IntentDetails(props) {
  const [intent, setIntent] = useState(props.intent);
  const entities = props.entities;
  const systemEntities = props.systemEntities;
  const [name, setName] = useState('');
  const [utterances, setUtterances] = useState([]);
  const [newExpression, setNewExpression] = useState(null);
  const [valid, setValid] = useState(true);
  const newExpressionInput = useRef(null);

  const focusOnExpressionInput = () => {
    newExpressionInput.current.focus();
    newExpressionInput.current.value = '';
    setActive(null);
  };

  function addNewValue() {
    let arr = [...utterances];
    let newUtterance = {
      raw: newExpression ? newExpression : '',
      model: [{
        text: newExpression ? newExpression : ''
      }]
    };
    arr = [newUtterance, ...arr];
    setUtterances(arr);
    setActive(0);
  }

  useEffect(() => {
    if (intent) {
      setName(intent.name);
      setUtterances(intent.utterances);
    }
  }, [intent]);
  useEffect(() => {
    if (name && utterances) {
      props.onUpdate({ ...intent,
        name: name,
        utterances: utterances
      });
    }
  }, [name, utterances]);

  if (intent) {
    return /*#__PURE__*/React.createElement("div", {
      className: "convo-details"
    }, /*#__PURE__*/React.createElement("section", {
      className: "layout--editor-content"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "margin--30--large"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "margin--10--large"
    }, "Intent name"), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      defaultValue: name ? name : '',
      placeholder: "Intent name",
      className: "editor-input input--item-name",
      onChange: e => {
        let message = 'Intent names shall begin with alphabetic characters from a to Z. The intent name may contain 1 underscore per word. Intent names shall not contain any numbers at all.';
        validateInput(e.target, e.target.value, '^[A-Za-z](_?[A-Za-z])*_?$', message);
        setName(e.target.value);
      },
      required: true
    }))), /*#__PURE__*/React.createElement("div", {
      className: "margin--50--large"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "margin--10--large"
    }, "Utterances"), /*#__PURE__*/React.createElement("div", {
      className: "margin--24--large"
    }, /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();

        if (newExpression) {
          addNewValue();
          setNewExpression(null);
          newExpressionInput.current.value = '';
        }
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "editor-input input--add-field",
      placeholder: "Enter reference value",
      onChange: e => setNewExpression(e.target.value),
      ref: newExpressionInput,
      onFocus: () => {
        setActive(null);
      }
    })), /*#__PURE__*/React.createElement(List, {
      addNewValue: addNewValue,
      utterances: utterances,
      setUtterances: setUtterances,
      entities: [entities, ...systemEntities],
      focusOnExpressionInput: focusOnExpressionInput
    }))))));
  } else {
    return null;
  }
}

const IntentEditor = props => {
  return /*#__PURE__*/React.createElement(IntentDetails, {
    intent: props.intent,
    entities: props.entities,
    systemEntities: props.systemEntities,
    onUpdate: props.onUpdate
  });
};
const EntityEditor = props => {
  return /*#__PURE__*/React.createElement(EntityDetails, {
    entity: props.entity,
    onUpdate: props.onUpdate
  });
};

export { EntityEditor, IntentEditor };
//# sourceMappingURL=index.modern.js.map
