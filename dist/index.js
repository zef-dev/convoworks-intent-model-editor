function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
require('lodash');
require('react-cool-onclickoutside');
require('react-autocomplete-input');
require('react-autocomplete-input/dist/bundle.css');
require('@yaireo/tagify/dist/react.tagify');
require('@yaireo/tagify/src/tagify.scss');
require('rangy');
var ContentEditable = _interopDefault(require('react-contenteditable'));

function IconTrash() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/React__default.createElement("g", {
    fill: "none",
    "fill-rule": "evenodd",
    stroke: "#1A1A1A",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M2.4 6.5v7c0 1.105.835 2 1.867 2h7.466c1.032 0 1.867-.895 1.867-2v-7M1.467 3.5h13.066M6.133 3.5v-3h3.734v3M8 7.5v5M10.8 7.5v5M5.2 7.5v5"
  })));
}

var EntityValue = function EntityValue(props) {
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

  var makeSynonyms = function makeSynonyms(items, active) {
    if (items) {
      return items && items.map(function (item, i) {
        if (item && !active) {
          return /*#__PURE__*/React__default.createElement("div", {
            className: "synonym",
            key: i
          }, item);
        } else {
          return /*#__PURE__*/React__default.createElement("div", {
            key: i,
            className: "synonym"
          }, item, /*#__PURE__*/React__default.createElement("button", {
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

  if (props.activeValue !== props.index) {
    return /*#__PURE__*/React__default.createElement("li", {
      className: "item item--entity " + (remove ? 'item--remove' : ''),
      onClick: function onClick() {
        props.setActiveValue(props.index);
      }
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "item__inner"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "cell cell--3--small"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "item__value item__value--primary"
    }, value)), /*#__PURE__*/React__default.createElement("div", {
      className: "cell cell--9--small"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "item__values"
    }, makeSynonyms(synonyms, false))))), /*#__PURE__*/React__default.createElement("div", {
      className: "item__buttons"
    }, /*#__PURE__*/React__default.createElement("button", {
      className: "btn--remove btn--remove--main",
      type: "button",
      onClick: function onClick(e) {
        handleRemove(e);
      }
    }, /*#__PURE__*/React__default.createElement(IconTrash, null))));
  } else {
    return /*#__PURE__*/React__default.createElement("li", {
      className: "item item--entity item--active " + (remove ? 'item--remove' : '')
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "item__inner"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "grid"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "cell cell--3--small"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "item__value item__value--primary"
    }, /*#__PURE__*/React__default.createElement("input", {
      "data-input": "true",
      className: "editor-input",
      type: "text",
      defaultValue: value,
      placeholder: "Enter value",
      onChange: function onChange(e) {
        setValue(e.target.value);
      }
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "cell cell--9--small"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "item__values"
    }, makeSynonyms(synonyms, true), /*#__PURE__*/React__default.createElement("form", {
      onSubmit: function onSubmit(e) {
        e.preventDefault();
        handleNewSynonym(synonymInput);
      }
    }, /*#__PURE__*/React__default.createElement("input", {
      className: "editor-input",
      type: "text",
      style: {
        marginLeft: '0.625rem'
      },
      ref: synonymInput,
      placeholder: "Enter synonym",
      onChange: function onChange(e) {}
    }), /*#__PURE__*/React__default.createElement("input", {
      className: "editor-input",
      type: "submit",
      hidden: true
    })))))), /*#__PURE__*/React__default.createElement("div", {
      className: "item__buttons"
    }, /*#__PURE__*/React__default.createElement("button", {
      className: "btn--remove btn--remove--main",
      type: "button",
      onClick: function onClick(e) {
        handleRemove(e);
      }
    }, /*#__PURE__*/React__default.createElement(IconTrash, null))));
  }
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
    }, "Entity name"), /*#__PURE__*/React__default.createElement("form", {
      onSubmit: function onSubmit(e) {
        e.preventDefault();
      }
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      defaultValue: name ? name : '',
      placeholder: "Entity name",
      className: "editor-input input--item-name",
      onChange: function onChange(e) {
        var message = 'Entity names shall begin with alphabetic characters from a to Z. The entity name may contain multiple underscores per word. Entity names shall not contain any numbers at all or soecial characters other than undersocres.';
        var validate = validateInput(e.target, e.target.value, '^[A-Za-z](_*[A-Za-z])*_*$', message);
        setValid(validate);
        setName(e.target.value);
      }
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "margin--50--large"
    }, /*#__PURE__*/React__default.createElement("h3", {
      className: "font--18--large margin--10--large"
    }, "Values"), /*#__PURE__*/React__default.createElement("div", {
      className: "margin--24--large"
    }, /*#__PURE__*/React__default.createElement(EntityValues, {
      values: values,
      setValues: setValues,
      removeValue: removeValue
    }), /*#__PURE__*/React__default.createElement("form", {
      onSubmit: function onSubmit(e) {
        e.preventDefault();

        if (newValue) {
          addNewValue();
          setNewValue(null);
          valueInput.current.value = '';
        }
      }
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      className: "editor-input input--add-field",
      placeholder: "Enter reference value",
      onChange: function onChange(e) {
        return setNewValue(e.target.value);
      },
      ref: valueInput
    })))))));
  } else {
    return null;
  }
}

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
  var shortened = this % 360;
  return "hsl(" + shortened + ",100%,70%)";
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

function Utterance(props) {
  var _useState = React.useState('');

  var _useState2 = React.useState(false);

  var _useState3 = React.useState({
    position: 0,
    active: false
  }),
      modalState = _useState3[0],
      setModalState = _useState3[1];

  var _useState4 = React.useState(null);

  var _useState5 = React.useState(props.data.model);

  var _useState6 = React.useState(null),
      selection = _useState6[0],
      setSelection = _useState6[1];

  var _useState7 = React.useState(props.data.model.filter(function (item) {
    return item.type;
  }).map(function (item) {
    return {
      text: item.text,
      type: item.type,
      slot_value: item.slot_value
    };
  })),
      whitelist = _useState7[0],
      setWhitelist = _useState7[1];

  var input = React.useRef('');
  var modalRef = React.useRef('');
  var tagsRef = React.useRef('');
  var text = React.useRef('');
  var targetText = React.useRef('');

  React.useEffect(function () {
    text.current = props.data.raw;
  }, []);

  var handleChange = function handleChange(evt) {
    text.current = evt.target.value;
    tagsRef.current.innerHTML = parseText(evt.target.value);
  };

  function parseText(string) {
    if (string) {
      var str = string.replace(/\s+/g, ' ').trim();
      var regex = new RegExp(whitelist.map(function (item) {
        return item.text.replace(/\s+/g, ' ').trim();
      }).join('|'), 'gi');
      str = str.replace(regex, function (matched) {
        return "<mark style=\"background:" + stringToColor(matched) + "\">" + matched + "</mark>";
      });
      return str;
    }
  }

  var tagSelection = function tagSelection() {
    setTimeout(function () {
      var list = [].concat(whitelist);
      list.map(function (item, index) {
        if (selection.includes(item.text) || item.text.includes(selection)) {
          list.splice(index, 1);
        }
      });
      list = [].concat(list, [{
        text: selection,
        type: '',
        slot_value: ''
      }]);
      setWhitelist(list);
      setSelection(null);
    }, 220);
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
      setSelection(sel.toString());
    } else {
      setSelection(null);
    }
  };

  React.useEffect(function () {
    var s = window.getSelection();
    var oRange = s.getRangeAt(0);
    var oRect = oRange.getBoundingClientRect();
    setModalState({
      position: oRect.x,
      active: selection !== null
    });
  }, [selection]);

  if (props.data) {
    var modalStyles = {
      position: 'absolute',
      top: '100%',
      transition: 'all 220ms ease-in-out',
      visibility: modalState.active ? 'visible' : 'hidden',
      opacity: modalState.active ? '1' : '0',
      left: modalState.position
    };
    return /*#__PURE__*/React__default.createElement("div", {
      "class": "field field--intent " + (props.active === props.index ? 'field--active' : ''),
      onClick: function onClick() {
        props.setActive(props.index);
      }
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "field__main",
      id: "input"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "field__input"
    }, /*#__PURE__*/React__default.createElement("div", {
      "class": "taggable-text"
    }, /*#__PURE__*/React__default.createElement(ContentEditable, {
      className: "taggable-text__input",
      html: text.current,
      onChange: handleChange,
      onKeyDown: function onKeyDown(e) {
        console.log(getCaretCharacterOffsetWithin(e.target));
      },
      onMouseUp: function onMouseUp(e) {
        handleSelection();
        console.log(getCaretCharacterOffsetWithin(e.target));
      },
      onKeyUp: function onKeyUp(e) {
        handleSelection();
      }
    }), /*#__PURE__*/React__default.createElement("div", {
      ref: tagsRef,
      className: "taggable-text__tags",
      contentEditable: false
    })))), /*#__PURE__*/React__default.createElement("div", null, whitelist.map(function (item) {
      return /*#__PURE__*/React__default.createElement("div", null, item.text);
    })), /*#__PURE__*/React__default.createElement("div", {
      "class": "dropdown",
      ref: modalRef,
      style: modalStyles
    }, /*#__PURE__*/React__default.createElement("div", {
      "class": "dropdown__inner"
    }, /*#__PURE__*/React__default.createElement("div", {
      "class": "dropdown__selection"
    }, "Selection: ", /*#__PURE__*/React__default.createElement("strong", null, selection))), /*#__PURE__*/React__default.createElement("button", {
      onClick: function onClick() {
        tagSelection();
      }
    }, "TAG!")));
  } else {
    return null;
  }
}

var List = React__default.memo(function List(props) {
  var _useState = React.useState(false);

  var _useState2 = React.useState(null);

  var _useState3 = React.useState(null),
      selection = _useState3[0];

  var _useState4 = React.useState(false);

  var _useState5 = React.useState(null),
      setParamValues = _useState5[1];

  var _useState6 = React.useState(null),
      active = _useState6[0],
      setActive = _useState6[1];

  React.useEffect(function () {
    var arr = props.utterances.map(function (item) {
      return item.model;
    }).flat().filter(function (item) {
      return item.slot_value;
    }).map(function (item) {
      return {
        type: item.type,
        slot_value: item.slot_value
      };
    });
    var uniq = arr.filter(function (v, i, a) {
      return a.findIndex(function (t) {
        return t.slot_value === v.slot_value;
      }) === i;
    });
    setParamValues(uniq);
  }, [props.utterances]);

  var makeItems = function makeItems(items) {
    return items.map(function (item, index) {
      return /*#__PURE__*/React__default.createElement(Utterance, {
        key: index,
        data: item,
        index: index,
        active: active,
        setActive: setActive
      });
    });
  };

  console.log(selection);

  if (props.utterances) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("ul", null, makeItems(props.utterances)));
  } else {
    return null;
  }
});

function IntentDetails(props) {
  var _useState = React.useState(props.intent),
      intent = _useState[0];

  var entities = props.entities;
  var systemEntities = props.systemEntities;

  var _useState2 = React.useState(''),
      name = _useState2[0],
      setName = _useState2[1];

  var _useState3 = React.useState([]),
      utterances = _useState3[0],
      setUtterances = _useState3[1];

  var _useState4 = React.useState(null),
      active = _useState4[0],
      setActive = _useState4[1];

  var _useState5 = React.useState(null),
      newExpression = _useState5[0],
      setNewExpression = _useState5[1];

  var _useState6 = React.useState(true);

  var newExpressionInput = React.useRef(null);

  var focusOnExpressionInput = function focusOnExpressionInput() {
    newExpressionInput.current.focus();
    newExpressionInput.current.value = '';
    setActive(null);
  };

  function addNewValue() {
    var arr = [].concat(utterances);
    var newUtterance = {
      raw: newExpression ? newExpression : '',
      model: [{
        text: newExpression ? newExpression : ''
      }]
    };
    arr = [newUtterance].concat(arr);
    setUtterances(arr);
    setActive(0);
  }

  var removeFromModel = function removeFromModel(utteranceIndex, index) {
    var arr = [].concat(utterances);
    var model = arr[utteranceIndex].model;
    model[index] = {
      text: model[index].text
    };
    setUtterances(arr);
  };

  React.useEffect(function () {
    if (intent) {
      setName(intent.name);
      setUtterances(intent.utterances);
    }
  }, [intent]);
  React.useEffect(function () {
    if (name && utterances) {
      props.onUpdate(_extends({}, intent, {
        name: name,
        utterances: utterances
      }));
    }
  }, [name, utterances]);

  if (intent) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "convo-details"
    }, /*#__PURE__*/React__default.createElement("section", {
      className: "layout--editor-content"
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
      className: "margin--30--large"
    }, /*#__PURE__*/React__default.createElement("h3", {
      className: "margin--10--large"
    }, "Intent name"), /*#__PURE__*/React__default.createElement("form", {
      onSubmit: function onSubmit(e) {
        e.preventDefault();
      }
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      defaultValue: name ? name : '',
      placeholder: "Intent name",
      className: "editor-input input--item-name",
      onChange: function onChange(e) {
        var message = 'Intent names shall begin with alphabetic characters from a to Z. The intent name may contain 1 underscore per word. Intent names shall not contain any numbers at all.';
        validateInput(e.target, e.target.value, '^[A-Za-z](_?[A-Za-z])*_?$', message);
        setName(e.target.value);
      },
      required: true
    }))), /*#__PURE__*/React__default.createElement("div", {
      className: "margin--50--large"
    }, /*#__PURE__*/React__default.createElement("h3", {
      className: "margin--10--large"
    }, "Utterances"), /*#__PURE__*/React__default.createElement("div", {
      className: "margin--24--large"
    }, /*#__PURE__*/React__default.createElement("form", {
      onSubmit: function onSubmit(e) {
        e.preventDefault();

        if (newExpression) {
          addNewValue();
          setNewExpression(null);
          newExpressionInput.current.value = '';
        }
      }
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "text",
      className: "editor-input input--add-field",
      placeholder: "Enter reference value",
      onChange: function onChange(e) {
        return setNewExpression(e.target.value);
      },
      ref: newExpressionInput,
      onFocus: function onFocus() {
        setActive(null);
      }
    })), /*#__PURE__*/React__default.createElement(List, {
      addNewValue: addNewValue,
      active: active,
      setActive: setActive,
      utterances: utterances,
      setUtterances: setUtterances,
      removeFromModel: removeFromModel,
      entities: [entities].concat(systemEntities),
      focusOnExpressionInput: focusOnExpressionInput
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
