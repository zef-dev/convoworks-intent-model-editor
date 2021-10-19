import React, { useState, useRef, useEffect } from 'react';
import 'react-svg';
import _ from 'lodash';
import rangy from 'rangy';
import ContentEditable from 'react-contenteditable';
import useOnclickOutside from 'react-cool-onclickoutside';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import sanitizeHtml from 'sanitize-html';

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
  return "hsl(" + shortened + ",100%, 80%)";
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
const preventSubmit = event => {
  if (event.keyCode == 13) {
    event.preventDefault();
    return false;
  }
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

const iconSearch = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABW0lEQVRIid3Uyy5sQRQG4A9DGhMSY7ehW5zZIXEZmnoavAQTvIHwCEJaTMToSPACBggibSgY7LXTrTm7q1sYWEllVWr/l6pVexW/PRaxjUs8xbjAFha+IjyCMl4bjEMMNys+i/sQuMYKxtEZYyLWbgJzj7+p4qN4COIOSgXYbuwG9k7iSfKy7KAtAd+GveAcNAIvqpalaOf10aNarvn6j+018+XI66g0YfCIjTqNT+MydjHWhHgeE8G9KAJVAtTVgkEpuB9O3v4Rm3S5/+O8FBlcRR5swWCoTuNTg3LkpRYMck65CLQgq+ONrIlSoxe3wZ1rBD4M4K60u+jAcXD2U3YzLGv73KSnANtbI/6MPykGMFNjcotVTMp+3xKmsKZalufIZ+hPNRmSvS2Nnut9TOOfaqMNpJqQvS2bOJc1USXmm95faN9XTFKjX1amV5x8h0Fucoqj7zL4+XgDjSNoKGD0WBAAAAAASUVORK5CYII=';
const iconTrash = 'data:image/png;base64,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';

const IconTrash = () => {
  return /*#__PURE__*/React.createElement("img", {
    src: iconTrash,
    alt: "Remove",
    "aria-label": "Remove",
    width: "32"
  });
};

const EntityValue = props => {
  const [value, setValue] = useState(props.item.value);
  const [synonyms, setSynonyms] = useState(props.item.synonyms);
  const [newSynonym, setNewSynonym] = useState('');
  const [remove, setRemove] = useState(false);
  const synonymInput = useRef(null);
  let active = props.activeValue === props.index;
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

  const makeSynonyms = (items, isActive) => {
    if (items) {
      return items && items.map((item, i) => {
        if (item) {
          return /*#__PURE__*/React.createElement("div", {
            key: i,
            className: "synonym"
          }, item, isActive && /*#__PURE__*/React.createElement("button", {
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

  return /*#__PURE__*/React.createElement("li", {
    className: `field field--${active ? 'active' : 'inactive'} field--entity ${remove ? 'field--remove' : ''}`,
    onClick: () => {
      props.setActiveValue(props.index);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "field__value"
  }, active ? /*#__PURE__*/React.createElement("input", {
    className: "editor-input",
    type: "text",
    defaultValue: value,
    placeholder: "Enter value",
    onKeyDown: e => preventSubmit(e),
    onChange: e => {
      setValue(e.target.value);
    }
  }) : /*#__PURE__*/React.createElement("input", {
    className: "editor-input",
    type: "text",
    defaultValue: value,
    placeholder: "Enter value",
    onKeyDown: e => preventSubmit(e),
    onChange: e => {
      setValue(e.target.value);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "field__synonyms"
  }, makeSynonyms(synonyms, active), /*#__PURE__*/React.createElement("input", {
    className: "editor-input",
    type: "text",
    style: {
      marginLeft: '0.625rem'
    },
    onKeyDown: e => {
      preventSubmit(e);

      if (e.keyCode == 13) {
        handleNewSynonym(synonymInput);
      }
    },
    ref: synonymInput,
    placeholder: "Enter synonym"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn--remove btn--remove--main",
    type: "button",
    onClick: e => {
      handleRemove(e);
    }
  }, /*#__PURE__*/React.createElement(IconTrash, null))));
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
const simpleValidateInput = (term, regex) => {
  let reg = new RegExp(regex);
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
    }, "Entity name"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      defaultValue: name ? name : '',
      placeholder: "Entity name",
      className: "editor-input input--item-name",
      onKeyDown: e => preventSubmit(e),
      onChange: e => {
        let message = 'Entity names shall begin with alphabetic characters from a to Z. The entity name may contain multiple underscores per word. Entity names shall not contain any numbers at all or soecial characters other than undersocres.';
        let validate = validateInput(e.target, e.target.value, '^[A-Za-z](_*[A-Za-z])*_*$', message);
        setValid(validate);
        setName(e.target.value);
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "margin--50--large"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "font--18--large margin--10--large"
    }, "Values"), /*#__PURE__*/React.createElement("div", {
      className: "margin--24--large"
    }, /*#__PURE__*/React.createElement(EntityValues, {
      values: values,
      setValues: setValues,
      removeValue: removeValue
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "editor-input input--add-field",
      placeholder: "Enter reference value",
      onKeyDown: e => {
        preventSubmit(e);

        if (e.keyCode === 13) {
          if (newValue) {
            addNewValue();
            setNewValue(null);
            valueInput.current.value = '';
          }
        }
      },
      onChange: e => setNewValue(e.target.value),
      ref: valueInput
    }))))));
  } else {
    return null;
  }
}

const UtteranceSlotValue = React.memo(props => {
  const [valid, setValid] = useState(true);

  const validateSlotValue = () => {
    let reg = /^[A-Za-z](_*[A-Za-z])*_*$/;
    setValid(reg.test(props.target.dataset.slotValue));
  };

  useEffect(() => {
    validateSlotValue();
  }, [props]);
  return /*#__PURE__*/React.createElement("input", {
    "data-valid": valid,
    pattern: "^[A-Za-z](_*[A-Za-z])*_*$",
    value: props.slotValue,
    onKeyDown: e => preventSubmit(e),
    onChange: e => {
      props.target.dataset.slotValue = e.target.value;
      props.updateRaw();
    }
  });
});

function Dropdown(props) {
  const [term, setTerm] = useState('');
  const [entities, setEntities] = useState(props.entities);
  const [entitiesNames, setEntitiesNames] = useState([]);
  const input = useRef();
  const modalRef = useOnclickOutside(() => {
    props.setSelection(null);
  });

  const filterEntities = str => {
    setTerm(str);
  };

  useEffect(() => {
    let arr = entities.flat().map(item => {
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
      className: "dropdown",
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
      onKeyDown: e => preventSubmit(e),
      onChange: e => {
        filterEntities(e);
      },
      ref: input,
      className: "dropdown__search editor-input",
      placeholder: "Filter entities"
    })), /*#__PURE__*/React.createElement("div", {
      className: "dropdown__items"
    }, entities.length && entities.flat().map((item, i) => {
      return /*#__PURE__*/React.createElement("button", {
        style: {
          display: item.name.toLowerCase().includes(term.toLocaleLowerCase().trim()) ? 'block' : 'none'
        },
        key: i,
        type: "button",
        onClick: () => {
          props.tagSelection(item.name);
        }
      }, "@", item.name);
    })));
  } else {
    return null;
  }
}

const UtteranceInput = props => {
  const [dropdownState, setDropdownState] = useState({
    position: 0,
    active: false
  });
  const [keyPress, setKeyPress] = useState('');
  const input = props.input;
  const cursorPosition = useRef(null);

  function createNode(type, slot_value, text) {
    let mark = document.createElement('mark');
    let newTextNode = document.createTextNode(text);
    mark.appendChild(newTextNode);
    mark.textContent = mark.textContent.trim();
    mark.setAttribute('data-type', type);
    mark.setAttribute('data-slot-value', slot_value);
    mark.setAttribute('data-text', mark.textContent.trim());
    mark.setAttribute('data-color', stringToColor(mark.textContent.trim()));
    mark.style.background = stringToColor(text);
    return mark;
  }

  const tagSelection = type => {
    if (props.selection) {
      if (!props.selection.tagName) {
        const getSlotValue = type => {
          let existingSlotValue = props.slotValuePairs.find(item => item.type === type);

          if (existingSlotValue) {
            return existingSlotValue.slot_value;
          } else {
            let arr = type.split('.');
            let str = arr[arr.length - 1];
            return str;
          }
        };

        let mark = createNode(type, getSlotValue(type), props.selection.toString());

        if (mark) {
          props.selection.getRangeAt(0).extractContents();
          props.selection.getRangeAt(0).insertNode(mark);

          if (mark.parentElement.tagName === "MARK") {
            mark.parentElement.replaceWith(...mark.parentElement.childNodes);
            mark.innerHTML = mark.textContent.trim();
          }

          input.current.childNodes.forEach(item => {
            if (item.tagName === "MARK") {
              if (item.innerHTML.slice(-1).includes(' ')) {
                item.innerHTML = item.innerHTML.trim();
              }
            }
          });
        }
      } else {
        let mark = props.selection;
        mark.style.outline = "none";
        mark.dataset.type = type;
      }

      let lastChar = input.current.innerHTML[input.current.innerHTML.length - 1];
      let newRaw = input.current.innerHTML + `${lastChar === ' ' ? '' : ' '}`;
      props.setRaw(newRaw);
      props.setSelection(null);
      cursorPosition.current && setCaretPosition(input.current, cursorPosition.current);
    }
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
    }

    if (sel.toString().length > 0) {
      let _sel = rangy.getSelection();

      props.setSelection(_sel);
    } else {
      props.setSelection(null);
    }
  };

  useEffect(() => {
    let s = window.getSelection();

    if (s && s.rangeCount > 0) {
      let oRange = s.getRangeAt(0);
      let oRect = oRange.getBoundingClientRect();
      setDropdownState({
        position: oRect.x / 2,
        active: props.selection !== null
      });
    } else {
      setDropdownState({ ...dropdownState,
        active: false
      });
    }
  }, [props.selection, props.active]);
  const sanitized = sanitizeHtml(props.raw, {
    allowedTags: ['mark'],
    allowedAttributes: false,
    exclusiveFilter: function (frame) {
      return !frame.text.trim();
    }
  });
  useEffect(() => {
    if (keyPress === 13) {
      props.handleNew(props.valid);
      setKeyPress('');
    }
  }, [keyPress]);
  return /*#__PURE__*/React.createElement("div", {
    className: "taggable-text"
  }, /*#__PURE__*/React.createElement(ContentEditable, {
    "data-placeholder": "Enter reference value",
    innerRef: input,
    className: "taggable-text__input",
    html: sanitized,
    onClick: e => {
      if (e.target.tagName === 'MARK') {
        props.setSelection(e.target);
      }
    },
    onChange: e => {
      props.setRaw(e.target.value);
      cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
    },
    onMouseUp: () => {
      handleSelection();
      cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
    },
    onKeyDown: e => {
      if (e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38) {
        setKeyPress(e.keyCode);
        e.preventDefault();
      }
    },
    onKeyUp: e => {
      handleSelection();
      cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
    },
    onFocus: () => {
      props.setActive(props.index);
    }
  }), props.active && /*#__PURE__*/React.createElement(Dropdown, {
    dropdownState: dropdownState,
    entities: props.entities,
    selection: props.selection,
    setSelection: props.setSelection,
    tagSelection: tagSelection
  }));
};

var UtteranceInput$1 = React.memo(UtteranceInput);

const Utterance = React.memo(props => {
  const [raw, setRaw] = useState('');
  const [selection, setSelection] = useState(null);
  const [valid, setValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const wrapper = useRef(null);
  const inputWrapper = useRef(null);
  const input = useRef(null);
  const whitelist = input.current && {
    tags: Array.from(input.current.childNodes).filter(item => item.dataset).map(item => {
      return {
        type: item.dataset.type,
        slot_value: item.dataset.slotValue,
        text: item.textContent.trim(),
        color: item.dataset.color,
        target: item
      };
    }).filter(item => item.text.trim().length),
    nodes: Array.from(input.current.childNodes).filter(item => item.textContent.trim().length > 0)
  };
  const active = props.active === props.index;
  useEffect(() => {
    if (props.utterance.model) {
      let str = '';

      if (props.utterance.model.length) {
        str = props.utterance.model.map(item => {
          if (item.type) {
            return `<mark data-type="${item.type}" data-slot-value="${item.slot_value}" data-text="${item.text}" data-color="${stringToColor(item.text)}" style="background:${stringToColor(item.text)}">${item.text.trim()}</mark>`;
          } else {
            return item.text.trim();
          }
        }).join(' ');
      }

      let lastChar = str[str.length - 1];
      setRaw(str + `${lastChar === '>' ? ' ' : ''}`);
    }
  }, [props.stateChange]);
  useEffect(() => {
    let isValid = wrapper.current.querySelectorAll("[data-valid='false']").length < 1;
    setValid(isValid);

    if (whitelist && whitelist.nodes) {
      let model = whitelist.nodes.map(item => {
        if (item.dataset) {
          return {
            type: item.dataset.type,
            text: item.textContent.trim(),
            slot_value: item.dataset.slotValue
          };
        } else {
          return {
            text: item.textContent.trim()
          };
        }
      }).filter(item => item.text.length);
      let raw = model.map(item => item.text).join(' ');
      let utterances = [...props.utterances];
      let newUtterance = {
        raw: raw,
        model: model
      };

      if (!_.isEqual(newUtterance, props.utterance)) {
        utterances[props.index] = newUtterance;
        props.setUtterances(utterances);
      }
    }
  }, [whitelist]);

  const handleValidationMessage = message => {
    if (validationMessage !== message) setValidationMessage(message);
  };

  const validateInput = () => {
    if (whitelist && whitelist.nodes) {
      let nodes = whitelist.nodes;
      let textNodes = nodes.filter(item => !item.tagName);
      let nodesMappedToString = nodes.map(item => {
        if (item.dataset && item.dataset.type) return `${item.textContent.trim()} {${item.dataset.type}}`;
        return item.textContent.trim();
      }).join(' ');

      if (props.allUtterancesInIntents.filter(item => item === nodesMappedToString).length > 1 && nodes.length > 0) {
        handleValidationMessage('Utterance must be unique');
        return false;
      }

      if (textNodes.length > 0) {
        let str = textNodes.map(item => item.textContent.trim()).join(' ');
        let reg = /^[a-zA-Z][a-zA-Z/"/'/`/\s]*$/;
        let strValid = reg.test(str.trim());
        handleValidationMessage(strValid ? '' : "Utterance can't contain special characters");
        return strValid;
      }

      handleValidationMessage('');
      return true;
    } else {
      handleValidationMessage('');
      return true;
    }
  };

  const updateRaw = () => {
    setRaw(input.current.innerHTML);
  };

  if (props) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      ref: wrapper,
      "data-field-valid": `${valid}`,
      className: `field field--intent ${active ? 'field--active' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "field__main"
    }, /*#__PURE__*/React.createElement("div", {
      ref: inputWrapper,
      className: "field__input",
      "data-valid": validateInput() ? 'true' : 'false'
    }, /*#__PURE__*/React.createElement(UtteranceInput$1, {
      index: props.index,
      input: input,
      active: active,
      setActive: props.setActive,
      utterances: props.utterances,
      raw: raw,
      setRaw: setRaw,
      entities: props.entities,
      selection: selection,
      setSelection: setSelection,
      slotValuePairs: props.slotValuePairs,
      handleNew: props.handleNew,
      valid: valid
    }), /*#__PURE__*/React.createElement("div", {
      className: "field__actions"
    }, props.index !== 0 && props.utterances.length > 1 && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        props.removeFromUtterances(props.utterance);
        document.querySelectorAll('.taggable-text__input')[0].focus();
      }
    }, /*#__PURE__*/React.createElement(IconTrash, null))))), !props.new && whitelist && whitelist.tags.length > 0 && /*#__PURE__*/React.createElement("ul", {
      className: "model-list",
      style: {
        display: active ? 'block' : 'none'
      }
    }, /*#__PURE__*/React.createElement("header", {
      className: "model-list__header"
    }, /*#__PURE__*/React.createElement("strong", null, "Parameter name"), /*#__PURE__*/React.createElement("strong", null, "Entity"), /*#__PURE__*/React.createElement("strong", null, "Resolved value")), whitelist.tags && whitelist.tags.map((item, index) => {
      return /*#__PURE__*/React.createElement("li", {
        className: "model-list__item",
        key: index
      }, /*#__PURE__*/React.createElement(UtteranceSlotValue, {
        key: index,
        index: index,
        target: item.target,
        slotValue: item.slot_value,
        whitelist: whitelist,
        updateRaw: updateRaw
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
        className: "mark",
        type: "button",
        style: {
          background: item.color
        },
        onClick: () => setTimeout(() => {
          setSelection(item.target);
        }, 220)
      }, item.type[0] === '@' ? '' : '@', item.type)), /*#__PURE__*/React.createElement("div", null, item.text));
    })), validationMessage.length > 0 && /*#__PURE__*/React.createElement("p", {
      className: "field__error"
    }, validationMessage)));
  } else {
    return null;
  }
});

const IntentUtterances = props => {
  const [active, setActive] = useState(null);

  const removeFromUtterances = object => {
    let arr = props.utterances.filter(item => item !== object);
    props.setUtterances(arr);
    setActive(null);
    props.setStateChange(!props.stateChange);
  };

  const handleNew = valid => {
    if (valid) {
      if (props.utterances[0].model.length > 0) {
        let newUtteranceField = {
          raw: '',
          model: []
        };
        let arr = [newUtteranceField, ...props.utterances];
        props.setUtterances(arr);
        props.setStateChange(!props.stateChange);
      }

      setTimeout(() => {
        let input = document.querySelectorAll('.taggable-text__input')[0];
        input && input.focus();
      }, 100);
    }
  };

  if (props.utterances) {
    return /*#__PURE__*/React.createElement("ul", null, props.utterances.map((item, index) => {
      return /*#__PURE__*/React.createElement("li", {
        key: index,
        style: {
          display: item.raw.toLowerCase().includes(props.searchPhrase) ? 'block' : 'none'
        }
      }, /*#__PURE__*/React.createElement(Utterance, {
        key: index,
        allUtterancesInIntents: props.allUtterancesInIntents,
        utterances: props.utterances,
        utterance: item,
        index: index,
        active: active,
        setActive: setActive,
        entities: props.entities,
        removeFromUtterances: removeFromUtterances,
        utterances: props.utterances,
        setUtterances: props.setUtterances,
        stateChange: props.stateChange,
        setStateChange: props.setStateChange,
        slotValuePairs: props.slotValuePairs,
        handleNew: handleNew
      }));
    }));
  } else {
    return null;
  }
};

var IntentUtterances$1 = React.memo(IntentUtterances);

function IntentDetails(props) {
  const [intent] = useState(props.intent);
  const entities = props.entities;
  const systemEntities = props.systemEntities;
  const [stateChange, setStateChange] = useState(false);
  const [name, setName] = useState('');
  const [utterances, setUtterances] = useState([]);
  const [slotValuePairs, setSlotValuePairs] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');
  useEffect(() => {
    if (intent) {
      setName(intent.name);

      if (intent.utterances.length) {
        setUtterances([{
          raw: '',
          model: []
        }, ...intent.utterances.filter(item => item.model.length > 0)]);
      } else {
        setUtterances([{
          raw: '',
          model: []
        }]);
      }
    }
  }, [intent]);

  const setInitialSlotValuePairs = () => {
    let arr = utterances.map(item => item.model).flat().filter(item => item.slot_value).map(item => ({
      type: item.type,
      slot_value: item.slot_value
    }));
    setSlotValuePairs(arr);
  };

  useEffect(() => {
    setInitialSlotValuePairs();
  }, [utterances]);
  useEffect(() => {
    if (name && utterances) {
      const valid = document.querySelectorAll('[data-field-valid="false"]').length < 1;
      let updatedIntent = {
        name: name,
        utterances: utterances.filter(item => item.model.length),
        type: intent.type || 'custom'
      };
      props.onUpdate(updatedIntent, valid);
    }
  }, [name, utterances]);

  const handleSearch = term => {
    setSearchPhrase(term);
  };

  const handleNameChange = e => {
    let message = 'Intent names shall begin with alphabetic characters from a to Z. The intent name may contain 1 underscore per word. Intent names shall not contain any numbers at all.';
    let isTextValid = simpleValidateInput(e.target.value, '^[A-Za-z](_?[A-Za-z])*_?$');
    let doesSameIntentNameExist = props.intents.filter(item => item.name === e.target.value && item !== intent).length > 0;

    if (!isTextValid) {
      e.target.setCustomValidity(message);
    } else if (doesSameIntentNameExist) {
      e.target.setCustomValidity('Intent name must be unique');
    } else {
      e.target.setCustomValidity('');
    }

    e.target.reportValidity();
    setName(e.target.value);
  };

  const mapUtterancesAsString = items => {
    return items.map(item => item.model.map(item => {
      if (item.type) return `${item.text} {${item.type}}`;
      return item.text;
    }).join(' '));
  };

  const allUtterancesInIntents = [mapUtterancesAsString(props.intents.map(item => item.utterances).flat()), ...mapUtterancesAsString(utterances)];

  if (intent) {
    return /*#__PURE__*/React.createElement("div", {
      className: "convo-details"
    }, /*#__PURE__*/React.createElement("section", {
      className: "layout--editor-content"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "margin--30--large"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "margin--10--large"
    }, "Intent name"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      defaultValue: name ? name : '',
      placeholder: "Intent name",
      className: "input input--item-name",
      onKeyDown: e => preventSubmit(e),
      onChange: e => handleNameChange(e)
    })), /*#__PURE__*/React.createElement("div", {
      className: "margin--50--large"
    }, /*#__PURE__*/React.createElement("div", {
      className: "search-wrapper"
    }, /*#__PURE__*/React.createElement("h3", null, "Utterances"), /*#__PURE__*/React.createElement("input", {
      style: {
        background: `url(${iconSearch}) no-repeat 12px center`,
        backgroundSize: '18px',
        paddingLeft: '42px'
      },
      className: "input input--search",
      type: "text",
      placeholder: "Search utterances",
      onChange: e => {
        handleSearch(e.target.value);
      },
      onKeyDown: e => preventSubmit(e)
    })), /*#__PURE__*/React.createElement("div", {
      className: "margin--24--large"
    }, /*#__PURE__*/React.createElement(IntentUtterances$1, {
      intents: props.intents,
      allUtterancesInIntents: allUtterancesInIntents,
      utterances: utterances,
      setUtterances: setUtterances,
      entities: [entities, ...systemEntities],
      stateChange: stateChange,
      setStateChange: setStateChange,
      searchPhrase: searchPhrase,
      slotValuePairs: slotValuePairs
    }))))));
  } else {
    return null;
  }
}

const IntentEditor = props => {
  return /*#__PURE__*/React.createElement(IntentDetails, {
    intents: props.intents,
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
