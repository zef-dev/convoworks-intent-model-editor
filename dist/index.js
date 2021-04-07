function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
require('react-svg');
var trash = _interopDefault(require('./trash~hOpExtCr.svg'));
var search = _interopDefault(require('./search~bbewSuiR.svg'));
var _ = require('lodash');
var ___default = _interopDefault(_);
var rangy = _interopDefault(require('rangy'));
var ContentEditable = _interopDefault(require('react-contenteditable'));
var useOnclickOutside = _interopDefault(require('react-cool-onclickoutside'));
var TextInput = _interopDefault(require('react-autocomplete-input'));
require('react-autocomplete-input/dist/bundle.css');
var sanitizeHtml = _interopDefault(require('sanitize-html'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

var stringToColor = function stringToColor(value) {
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
var getCaretCharacterOffsetWithin = function getCaretCharacterOffsetWithin(element) {
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
var preventSubmit = function preventSubmit(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    return false;
  }
};
var setCaretPosition = function setCaretPosition(el, pos) {
  for (var _iterator = _createForOfIteratorHelperLoose(el.childNodes), _step; !(_step = _iterator()).done;) {
    var node = _step.value;

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

var IconTrash = function IconTrash() {
  return /*#__PURE__*/React__default.createElement("img", {
    src: trash
  });
};

var EntityValue = function EntityValue(props) {
  var _React$createElement;

  var _useState = React.useState(props.item.value),
      value = _useState[0],
      setValue = _useState[1];

  var _useState2 = React.useState(props.item.synonyms),
      synonyms = _useState2[0],
      setSynonyms = _useState2[1];

  var _useState3 = React.useState(''),
      newSynonym = _useState3[0],
      setNewSynonym = _useState3[1];

  var _useState4 = React.useState(false),
      remove = _useState4[0],
      setRemove = _useState4[1];

  var synonymInput = React.useRef(null);
  var active = props.activeValue === props.index;
  React.useEffect(function () {
    props.handleUpdate([].concat(props.values), props.index, {
      value: value,
      synonyms: synonyms
    });
  }, [value, synonyms]);
  React.useEffect(function () {
    if (newSynonym) {
      if (synonyms) {
        setSynonyms([].concat(synonyms, [newSynonym]));
      } else {
        setSynonyms(newSynonym);
      }
    }
  }, [newSynonym]);

  var handleNewSynonym = function handleNewSynonym(target) {
    if (target.current.value.length > 0) {
      setNewSynonym(target.current.value);
      target.current.value = '';
    } else {
      setNewSynonym('');
    }
  };

  var removeSynonym = function removeSynonym(value) {
    var arr = [].concat(synonyms);
    var index = arr.indexOf(value);

    if (index !== -1) {
      arr.splice(index, 1);
      setSynonyms(arr);
    }
  };

  var makeSynonyms = function makeSynonyms(items, isActive) {
    if (items) {
      return items && items.map(function (item, i) {
        if (item) {
          return /*#__PURE__*/React__default.createElement("div", {
            key: i,
            className: "synonym"
          }, item, isActive && /*#__PURE__*/React__default.createElement("button", {
            type: "button",
            className: "synonym__remove",
            onClick: function onClick() {
              removeSynonym(item);
            }
          }, "\u2715"));
        }
      });
    }
  };

  var handleRemove = function handleRemove(e) {
    e.stopPropagation();
    setRemove(true);
    setTimeout(function () {
      props.removeValue(props.index);
      setRemove(false);
    }, 220);
  };

  return /*#__PURE__*/React__default.createElement("li", {
    className: "field field--" + (active ? 'active' : 'inactive') + " field--entity " + (remove ? 'field--remove' : ''),
    onClick: function onClick() {
      props.setActiveValue(props.index);
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    "class": "field__value"
  }, active ? /*#__PURE__*/React__default.createElement("input", {
    className: "editor-input",
    type: "text",
    defaultValue: value,
    placeholder: "Enter value",
    onKeyDown: function onKeyDown(e) {
      return preventSubmit(e);
    },
    onChange: function onChange(e) {
      setValue(e.target.value);
    }
  }) : /*#__PURE__*/React__default.createElement("input", {
    className: "editor-input",
    type: "text",
    defaultValue: value,
    placeholder: "Enter value",
    onKeyDown: function onKeyDown(e) {
      return preventSubmit(e);
    },
    onChange: function onChange(e) {
      setValue(e.target.value);
    }
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "field__synonyms"
  }, makeSynonyms(synonyms, active), /*#__PURE__*/React__default.createElement("input", (_React$createElement = {
    className: "editor-input",
    type: "text",
    style: {
      marginLeft: '0.625rem'
    },
    onKeyDown: function onKeyDown(e) {
      return preventSubmit(e);
    }
  }, _React$createElement["onKeyDown"] = function onKeyDown(e) {
    if (e.keyCode == 13) {
      handleNewSynonym(synonymInput);
    }
  }, _React$createElement.ref = synonymInput, _React$createElement.placeholder = "Enter synonym", _React$createElement))), /*#__PURE__*/React__default.createElement("div", {
    className: "field__actions"
  }, /*#__PURE__*/React__default.createElement("button", {
    className: "btn--remove btn--remove--main",
    type: "button",
    onClick: function onClick(e) {
      handleRemove(e);
    }
  }, /*#__PURE__*/React__default.createElement(IconTrash, null))));
};

function EntityValues(props) {
  var _useState = React.useState(null),
      activeValue = _useState[0],
      setActiveValue = _useState[1];

  function handleUpdate(arr, index, item) {
    arr[index] = {
      value: item.value,
      synonyms: item.synonyms
    };
    props.setValues(arr);
  }

  var makeItems = function makeItems(items) {
    if (items) {
      return items.map(function (item, index) {
        return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
          key: index
        }, /*#__PURE__*/React__default.createElement(EntityValue, {
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
    return /*#__PURE__*/React__default.createElement("div", null, makeItems(props.values));
  } else {
    return null;
  }
}

var validateInput = function validateInput(elem, term, regex, message) {
  var reg = new RegExp(regex);

  if (reg.test(term)) {
    elem.setCustomValidity('');
  } else {
    elem.setCustomValidity(message);
  }

  elem.reportValidity();
  return reg.test(term);
};

function EntityDetails(props) {
  var _useState = React.useState(null),
      entity = _useState[0],
      setEntity = _useState[1];

  var _useState2 = React.useState(null),
      name = _useState2[0],
      setName = _useState2[1];

  var _useState3 = React.useState(null),
      values = _useState3[0],
      setValues = _useState3[1];

  var _useState4 = React.useState(null),
      newValue = _useState4[0],
      setNewValue = _useState4[1];

  var _useState5 = React.useState(true),
      valid = _useState5[0],
      setValid = _useState5[1];

  var valueInput = React.useRef(null);
  React.useEffect(function () {
    if (!entity) {
      setEntity(props.entity);
    }
  }, [props.entity]);
  React.useEffect(function () {
    setName(props.entity.name);
    setValues(props.entity.values);
  }, [entity]);
  React.useEffect(function () {
    if (name && values) {
      props.onUpdate({
        name: name,
        values: values
      }, valid);
    }
  }, [name, values]);

  var addNewValue = function addNewValue() {
    var val = {
      value: newValue,
      synonyms: []
    };
    var arr = [].concat(values, [val]);
    setValues(arr);
  };

  var removeValue = function removeValue(index) {
    var arr = [].concat(values);

    if (index !== -1) {
      arr.splice(index, 1);
      setValues(arr);
    }
  };

  if (values) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "convo-details"
    }, /*#__PURE__*/React__default.createElement("section", {
      className: "layout--editor-content"
    }, /*#__PURE__*/React__default.createElement("section", {
      className: "entities-editor"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "margin--30--large"
    }, /*#__PURE__*/React__default.createElement("h3", {
      className: "margin--10--large"
    }, "Entity name"), /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      defaultValue: name ? name : '',
      placeholder: "Entity name",
      className: "editor-input input--item-name",
      onKeyDown: function onKeyDown(e) {
        return preventSubmit(e);
      },
      onChange: function onChange(e) {
        var message = 'Entity names shall begin with alphabetic characters from a to Z. The entity name may contain multiple underscores per word. Entity names shall not contain any numbers at all or soecial characters other than undersocres.';
        var validate = validateInput(e.target, e.target.value, '^[A-Za-z](_*[A-Za-z])*_*$', message);
        setValid(validate);
        setName(e.target.value);
      }
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "margin--50--large"
    }, /*#__PURE__*/React__default.createElement("h3", {
      className: "font--18--large margin--10--large"
    }, "Values"), /*#__PURE__*/React__default.createElement("div", {
      className: "margin--24--large"
    }, /*#__PURE__*/React__default.createElement(EntityValues, {
      values: values,
      setValues: setValues,
      removeValue: removeValue
    }), /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      className: "editor-input input--add-field",
      placeholder: "Enter reference value",
      onKeyDown: function onKeyDown(e) {
        preventSubmit(e);

        if (e.keyCode === 13) {
          if (newValue) {
            addNewValue();
            setNewValue(null);
            valueInput.current.value = '';
          }
        }
      },
      onChange: function onChange(e) {
        return setNewValue(e.target.value);
      },
      ref: valueInput
    }))))));
  } else {
    return null;
  }
}

var UtteranceSlotValue = React__default.memo(function (props) {
  var _useState = React.useState(true),
      valid = _useState[0],
      setValid = _useState[1];

  var validateSlotValue = function validateSlotValue() {
    var reg = /^[A-Za-z](_*[A-Za-z])*_*$/;
    setValid(reg.test(props.target.dataset.slotValue));
  };

  React.useEffect(function () {
    validateSlotValue();
  }, [props]);
  return /*#__PURE__*/React__default.createElement("input", {
    "data-valid": valid,
    pattern: "^[A-Za-z](_*[A-Za-z])*_*$",
    value: props.slotValue,
    onKeyDown: function onKeyDown(e) {
      return preventSubmit(e);
    },
    onChange: function onChange(e) {
      props.target.dataset.slotValue = e.target.value;
      props.updateRaw();
    }
  });
});

function Dropdown(props) {
  var _useState = React.useState(''),
      term = _useState[0],
      setTerm = _useState[1];

  var _useState2 = React.useState(props.entities),
      entities = _useState2[0];

  var _useState3 = React.useState([]),
      entitiesNames = _useState3[0],
      setEntitiesNames = _useState3[1];

  var input = React.useRef();
  var modalRef = useOnclickOutside(function () {
    props.setSelection(null);
  });

  var filterEntities = function filterEntities(str) {
    setTerm(str);
  };

  React.useEffect(function () {
    var arr = entities.flat().map(function (item) {
      return item.name;
    }).filter(function (item) {
      return item;
    });
    setEntitiesNames(arr);
  }, [entities]);

  if (entities) {
    var dropdownStyles = {
      position: 'absolute',
      top: '100%',
      transition: 'all 220ms ease-in-out',
      visibility: props.dropdownState.active ? 'visible' : 'hidden',
      opacity: props.dropdownState.active ? '1' : '0',
      left: props.dropdownState.position
    };
    return /*#__PURE__*/React__default.createElement("div", {
      "class": "dropdown",
      ref: modalRef,
      style: dropdownStyles
    }, /*#__PURE__*/React__default.createElement("header", {
      className: "dropdown__header"
    }, /*#__PURE__*/React__default.createElement(TextInput, {
      Component: "input",
      trigger: "",
      options: entitiesNames,
      spaceRemovers: [],
      matchAny: true,
      onKeyDown: function onKeyDown(e) {
        return preventSubmit(e);
      },
      onChange: function onChange(e) {
        filterEntities(e);
      },
      ref: input,
      className: "dropdown__search editor-input",
      placeholder: "Filter entities"
    })), /*#__PURE__*/React__default.createElement("div", {
      "class": "dropdown__items"
    }, entities.length && entities.flat().map(function (item, i) {
      return /*#__PURE__*/React__default.createElement("button", {
        style: {
          display: item.name.toLowerCase().includes(term.toLocaleLowerCase().trim()) ? 'block' : 'none'
        },
        key: i,
        type: "button",
        onClick: function onClick() {
          props.tagSelection(item.name);
        }
      }, "@", item.name);
    })));
  } else {
    return null;
  }
}

var UtteranceInput = function UtteranceInput(props) {
  var _useState = React.useState({
    position: 0,
    active: false
  }),
      dropdownState = _useState[0],
      setDropdownState = _useState[1];

  var input = props.input;
  var cursorPosition = React.useRef(null);

  function createNode(type, slot_value, text) {
    var mark = document.createElement('mark');
    var newTextNode = document.createTextNode(text);
    mark.appendChild(newTextNode);
    mark.textContent = mark.textContent.trim();
    mark.setAttribute('data-type', type);
    mark.setAttribute('data-slot-value', slot_value);
    mark.setAttribute('data-text', mark.textContent.trim());
    mark.setAttribute('data-color', stringToColor(mark.textContent.trim()));
    mark.style.background = stringToColor(text);
    return mark;
  }

  var tagSelection = function tagSelection(type) {
    if (props.selection) {
      if (!props.selection.tagName) {
        var getSlotValue = function getSlotValue(type) {
          var existingSlotValue = props.slotValuePairs.find(function (item) {
            return item.type === type;
          });
          console.log('is there --->', existingSlotValue);

          if (existingSlotValue) {
            return existingSlotValue.slot_value;
          } else {
            var arr = type.split('.');
            var str = arr[arr.length - 1];
            return str;
          }
        };

        var mark = createNode(type, getSlotValue(type), props.selection.toString());

        if (mark) {
          props.selection.getRangeAt(0).extractContents();
          props.selection.getRangeAt(0).insertNode(mark);

          if (mark.parentElement.tagName === "MARK") {
            var _mark$parentElement;

            (_mark$parentElement = mark.parentElement).replaceWith.apply(_mark$parentElement, mark.parentElement.childNodes);

            mark.innerHTML = mark.textContent.trim();
          }

          input.current.childNodes.forEach(function (item) {
            if (item.tagName === "MARK") {
              if (item.innerHTML.slice(-1).includes(' ')) {
                item.innerHTML = item.innerHTML.trim();
              }
            }
          });
        }
      } else {
        var _mark = props.selection;
        _mark.style.outline = "none";
        _mark.dataset.type = type;
      }

      var lastChar = input.current.innerHTML[input.current.innerHTML.length - 1];
      var newRaw = input.current.innerHTML + ("" + (lastChar === ' ' ? '' : ' '));
      props.setRaw(newRaw);
      props.setSelection(null);
      cursorPosition.current && setCaretPosition(input.current, cursorPosition.current);
    }
  };

  var handleSelection = function handleSelection() {
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
      var _sel = rangy.getSelection();

      props.setSelection(_sel);
    } else {
      props.setSelection(null);
    }
  };

  React.useEffect(function () {
    var s = window.getSelection();

    if (s && s.rangeCount > 0) {
      var oRange = s.getRangeAt(0);
      var oRect = oRange.getBoundingClientRect();
      setDropdownState({
        position: oRect.x / 2,
        active: props.selection !== null
      });
    } else {
      setDropdownState(_extends({}, dropdownState, {
        active: false
      }));
    }
  }, [props.selection, props.active]);
  var sanitized = sanitizeHtml(props.raw, {
    allowedTags: ['mark'],
    allowedAttributes: false,
    exclusiveFilter: function exclusiveFilter(frame) {
      return !frame.text.trim();
    }
  });
  return /*#__PURE__*/React__default.createElement("div", {
    "class": "taggable-text"
  }, /*#__PURE__*/React__default.createElement(ContentEditable, {
    "data-placeholder": "Enter reference value",
    innerRef: input,
    className: "taggable-text__input",
    html: sanitized,
    onClick: function onClick(e) {
      if (e.target.tagName === 'MARK') {
        props.setSelection(e.target);
      }
    },
    onChange: function onChange(e) {
      props.setRaw(e.target.value);
      cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
    },
    onMouseUp: function onMouseUp() {
      handleSelection();
      cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38) {
        e.preventDefault();

        if (e.keyCode === 13) {
          document.querySelectorAll('.taggable-text__input')[0].focus();
        }
      }
    },
    onKeyUp: function onKeyUp(e) {
      handleSelection();
      cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
    },
    onFocus: function onFocus() {
      props.setActive(props.index);
    }
  }), props.active && /*#__PURE__*/React__default.createElement(Dropdown, {
    dropdownState: dropdownState,
    entities: props.entities,
    selection: props.selection,
    setSelection: props.setSelection,
    tagSelection: tagSelection
  }));
};

var UtteranceInput$1 = React__default.memo(UtteranceInput);

var Utterance = React__default.memo(function (props) {
  var _useState = React.useState(''),
      raw = _useState[0],
      setRaw = _useState[1];

  var _useState2 = React.useState(null),
      selection = _useState2[0],
      setSelection = _useState2[1];

  var _useState3 = React.useState(true),
      valid = _useState3[0],
      setValid = _useState3[1];

  var wrapper = React.useRef(null);
  var input = React.useRef(null);
  var whitelist = input.current && {
    tags: Array.from(input.current.childNodes).filter(function (item) {
      return item.dataset;
    }).map(function (item) {
      return {
        type: item.dataset.type,
        slot_value: item.dataset.slotValue,
        text: item.textContent.trim(),
        color: item.dataset.color,
        target: item
      };
    }).filter(function (item) {
      return item.text.trim().length;
    }),
    nodes: Array.from(input.current.childNodes).filter(function (item) {
      return item.textContent.trim().length > 0;
    })
  };
  var active = props.active === props.index;
  React.useEffect(function () {
    if (props.utterance.model) {
      var str = '';

      if (props.utterance.model.length) {
        str = props.utterance.model.map(function (item) {
          if (item.type) {
            return "<mark data-type=\"" + item.type + "\" data-slot-value=\"" + item.slot_value + "\" data-text=\"" + item.text + "\" data-color=\"" + stringToColor(item.text) + "\" style=\"background:" + stringToColor(item.text) + "\">" + item.text.trim() + "</mark>";
          } else {
            return item.text.trim();
          }
        }).join(' ');
      }

      var lastChar = str[str.length - 1];
      setRaw(str + ("" + (lastChar === '>' ? ' ' : '')));
    }
  }, [props.stateChange]);
  React.useEffect(function () {
    var isValid = wrapper.current.querySelectorAll("[data-valid='false']").length < 1;
    setValid(isValid);

    if (whitelist && whitelist.nodes) {
      var model = whitelist.nodes.map(function (item) {
        if (item.dataset) {
          return {
            type: item.dataset.type,
            text: item.textContent,
            slot_value: item.dataset.slotValue
          };
        } else {
          return {
            text: item.textContent
          };
        }
      }).filter(function (item) {
        return item.text.length;
      });

      var _raw = model.map(function (item) {
        return item.text;
      }).join(' ');

      var utterances = [].concat(props.utterances);
      var newUtterance = {
        raw: _raw,
        model: model
      };

      if (!___default.isEqual(newUtterance, props.utterance)) {
        utterances[props.index] = newUtterance;
        props.setUtterances(utterances);
      }
    }
  }, [whitelist]);

  var validateInput = function validateInput() {
    if (whitelist && whitelist.nodes) {
      var nodes = whitelist.nodes;
      var textNodes = nodes.filter(function (item) {
        return !item.tagName;
      });

      if (whitelist.tags.length > 0 && textNodes.length < 1) {
        return true;
      } else if (textNodes.length > 0) {
        var str = textNodes.map(function (item) {
          return item.textContent.trim();
        }).join(' ');
        var reg = /^[a-zA-Z][a-zA-Z/"/'/`/\s]*$/;
        return reg.test(str.trim());
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  var updateRaw = function updateRaw() {
    setRaw(input.current.innerHTML);
  };

  if (props) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
      ref: wrapper,
      "data-field-valid": "" + valid,
      "class": "field field--intent " + (active ? 'field--active' : '')
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "field__main"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "field__input",
      "data-valid": validateInput() ? 'true' : 'false'
    }, /*#__PURE__*/React__default.createElement(UtteranceInput$1, {
      index: props.index,
      input: input,
      active: active,
      setActive: props.setActive,
      raw: raw,
      setRaw: setRaw,
      entities: props.entities,
      selection: selection,
      setSelection: setSelection,
      slotValuePairs: props.slotValuePairs
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "field__actions"
    }, !props["new"] && /*#__PURE__*/React__default.createElement("button", {
      type: "button",
      onClick: function onClick() {
        props.removeFromUtterances(props.utterance);
        document.querySelectorAll('.taggable-text__input')[0].focus();
      }
    }, /*#__PURE__*/React__default.createElement(IconTrash, null))))), !props["new"] && whitelist && whitelist.tags.length > 0 && /*#__PURE__*/React__default.createElement("ul", {
      className: "model-list",
      style: {
        display: active ? 'block' : 'none'
      }
    }, /*#__PURE__*/React__default.createElement("header", {
      className: "model-list__header"
    }, /*#__PURE__*/React__default.createElement("strong", null, "Parameter name"), /*#__PURE__*/React__default.createElement("strong", null, "Entity"), /*#__PURE__*/React__default.createElement("strong", null, "Resolved value")), whitelist.tags && whitelist.tags.map(function (item, index) {
      return /*#__PURE__*/React__default.createElement("li", {
        className: "model-list__item"
      }, /*#__PURE__*/React__default.createElement(UtteranceSlotValue, {
        key: index,
        index: index,
        target: item.target,
        slotValue: item.slot_value,
        whitelist: whitelist,
        updateRaw: updateRaw
      }), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("button", {
        className: "mark",
        type: "button",
        style: {
          background: item.color
        },
        onClick: function onClick() {
          return setTimeout(function () {
            setSelection(item.target);
          }, 220);
        }
      }, "@", item.type)), /*#__PURE__*/React__default.createElement("div", null, item.text));
    }))));
  } else {
    return null;
  }
});

var IntentUtterances = function IntentUtterances(props) {
  var _useState = React.useState(null),
      active = _useState[0],
      setActive = _useState[1];

  var removeFromUtterances = function removeFromUtterances(object) {
    var arr = props.utterances.filter(function (item) {
      return item !== object;
    });
    props.setUtterances(arr);
    setActive(null);
    props.setStateChange(!props.stateChange);
  };

  if (props.utterances) {
    return /*#__PURE__*/React__default.createElement("ul", null, props.utterances.map(function (item, index) {
      var isNew = index === 0 && item.model.length === 0;
      return /*#__PURE__*/React__default.createElement("li", {
        key: index,
        style: {
          display: item.raw.toLowerCase().includes(props.searchPhrase) ? 'block' : 'none'
        }
      }, /*#__PURE__*/React__default.createElement(Utterance, {
        key: index,
        utterance: item,
        "new": isNew,
        index: index,
        active: active,
        setActive: setActive,
        entities: props.entities,
        removeFromUtterances: removeFromUtterances,
        utterances: props.utterances,
        setUtterances: props.setUtterances,
        stateChange: props.stateChange,
        setStateChange: props.setStateChange,
        slotValuePairs: props.slotValuePairs
      }));
    }));
  } else {
    return null;
  }
};

var IntentUtterances$1 = React__default.memo(IntentUtterances);

function useDebounce(value, delay) {
  var _useState = React.useState(value),
      debouncedValue = _useState[0],
      setDebouncedValue = _useState[1];

  React.useEffect(function () {
    var handler = setTimeout(function () {
      setDebouncedValue(value);
    }, delay);
    return function () {
      clearTimeout(handler);
    };
  }, [value]);
  return debouncedValue;
}

function IntentDetails(props) {
  var _useState = React.useState(props.intent),
      intent = _useState[0];

  var entities = props.entities;
  var systemEntities = props.systemEntities;

  var _useState2 = React.useState(false),
      stateChange = _useState2[0],
      setStateChange = _useState2[1];

  var _useState3 = React.useState(''),
      name = _useState3[0],
      setName = _useState3[1];

  var _useState4 = React.useState([]),
      utterances = _useState4[0],
      setUtterances = _useState4[1];

  var _useState5 = React.useState([]),
      slotValuePairs = _useState5[0],
      setSlotValuePairs = _useState5[1];

  var _useState6 = React.useState(''),
      searchPhrase = _useState6[0],
      setSearchPhrase = _useState6[1];

  var searchInput = React.useRef(null);
  React.useEffect(function () {
    if (intent) {
      setName(intent.name);
      setUtterances(intent.utterances);
    }
  }, [intent]);

  var handleNew = function handleNew() {
    var newUtteranceField = {
      raw: '',
      model: []
    };

    if (utterances[0] && utterances[0].model.length > 0) {
      var arr = [newUtteranceField].concat(utterances);
      setUtterances(arr);
      setStateChange(!stateChange);
      var input = document.querySelectorAll('.taggable-text__input')[1];
      input && input.focus();
    }
  };

  var setInitialSlotValuePairs = function setInitialSlotValuePairs() {
    var arr = utterances.map(function (item) {
      return item.model;
    }).flat().filter(function (item) {
      return item.slot_value;
    }).map(function (item) {
      return {
        type: item.type,
        slot_value: item.slot_value
      };
    });
    setSlotValuePairs(arr);
  };

  var debouncedHandleNew = useDebounce(handleNew, 300);
  React.useEffect(function () {
    setInitialSlotValuePairs();
  }, [utterances]);
  React.useEffect(function () {
    if (name && utterances) {
      var valid = document.querySelectorAll('[data-field-valid="false"]').length < 1;

      var _intent = _extends({}, _intent, {
        name: name,
        utterances: utterances
      });

      props.onUpdate(_intent, valid);
    }
  }, [name, utterances]);

  var handleSearch = function handleSearch() {
    if (searchInput.current) {
      var term = searchInput.current.value.toLowerCase().trim();
      setSearchPhrase(term);
    }
  };

  if (utterances.length) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "convo-details"
    }, /*#__PURE__*/React__default.createElement("section", {
      className: "layout--editor-content"
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
      className: "margin--30--large"
    }, /*#__PURE__*/React__default.createElement("h3", {
      className: "margin--10--large"
    }, "Intent name"), /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      defaultValue: name ? name : '',
      placeholder: "Intent name",
      className: "input input--item-name",
      onKeyDown: function onKeyDown(e) {
        return preventSubmit(e);
      },
      onChange: function onChange(e) {
        var message = 'Intent names shall begin with alphabetic characters from a to Z. The intent name may contain 1 underscore per word. Intent names shall not contain any numbers at all.';
        validateInput(e.target, e.target.value, '^[A-Za-z](_?[A-Za-z])*_?$', message);
        setName(e.target.value);
      }
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "margin--50--large"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "search-wrapper"
    }, /*#__PURE__*/React__default.createElement("h3", null, "Utterances"), /*#__PURE__*/React__default.createElement("input", {
      style: {
        background: "url(" + search + ") no-repeat 12px center",
        backgroundSize: '18px',
        paddingLeft: '42px'
      },
      className: "input input--search",
      type: "text",
      placeholder: "Search utterances",
      onChange: function onChange() {
        handleSearch();
      },
      onKeyDown: function onKeyDown(e) {
        return preventSubmit(e);
      }
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "margin--24--large"
    }, /*#__PURE__*/React__default.createElement(IntentUtterances$1, {
      utterances: utterances,
      setUtterances: setUtterances,
      entities: [entities].concat(systemEntities),
      stateChange: stateChange,
      setStateChange: setStateChange,
      searchPhrase: searchPhrase,
      slotValuePairs: slotValuePairs
    }))))));
  } else {
    return null;
  }
}

var IntentEditor = function IntentEditor(props) {
  return /*#__PURE__*/React__default.createElement(IntentDetails, {
    intent: props.intent,
    entities: props.entities,
    systemEntities: props.systemEntities,
    onUpdate: props.onUpdate
  });
};
var EntityEditor = function EntityEditor(props) {
  return /*#__PURE__*/React__default.createElement(EntityDetails, {
    entity: props.entity,
    onUpdate: props.onUpdate
  });
};

exports.EntityEditor = EntityEditor;
exports.IntentEditor = IntentEditor;
//# sourceMappingURL=index.js.map
