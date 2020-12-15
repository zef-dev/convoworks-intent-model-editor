function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
require('lodash');
var useOnclickOutside = _interopDefault(require('react-cool-onclickoutside'));
var TextInput = _interopDefault(require('react-autocomplete-input'));
require('react-autocomplete-input/dist/bundle.css');
var ContentEditable = _interopDefault(require('react-contenteditable'));
var reactHtmlParser = _interopDefault(require('react-html-parser'));

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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var getColor = function getColor(index) {
  var arr = ["#56ebd3", "#fbacf6", "#9ee786", "#e4b5ff", "#c2e979", "#20d8fd", "#e8d25c", "#42edec", "#f3c46f", "#5cefba", "#e8de7a", "#7ee8c0", "#e8d98c", "#88e99a", "#cfdd73", "#8be8ad", "#dff799", "#b5eaa1", "#c2d681", "#b5e287"];
  return arr[index % arr.length];
};

function Modal(props) {
  var _useState = React.useState(props.entities),
      entities = _useState[0],
      setEntities = _useState[1];

  var _useState2 = React.useState(props.entities),
      allEntities = _useState2[0];

  var _useState3 = React.useState([]),
      entitiesNames = _useState3[0],
      setEntitiesNames = _useState3[1];

  var input = React.useRef();
  var modalRef = useOnclickOutside(function () {
    props.setModal(false);
    props.setSelection(null);
  });

  var filterEntities = function filterEntities(term) {
    var arr = [].concat(allEntities);
    var filteredArr = arr.filter(function (item) {
      return item.name && item.name.toLowerCase().includes(term.trim().toLowerCase());
    });
    setEntities(filteredArr);
  };

  React.useEffect(function () {
    var arr = entities.map(function (item) {
      return item.name;
    }).filter(function (item) {
      return item;
    });
    setEntitiesNames(arr);
  }, [entities]);

  var makeEntities = function makeEntities(items) {
    var handleDefaultParam = function handleDefaultParam(param) {
      if (param.includes('.')) {
        return param.split('.').pop();
      } else {
        return param.split('@').pop();
      }
    };

    if (items) {
      return items.map(function (item, i) {
        return /*#__PURE__*/React__default.createElement("button", {
          key: i,
          onClick: function onClick(e) {
            e.preventDefault();
            var type = '@' + item.name;
            var slotValue = item.name;

            var getParamValues = function getParamValues() {
              var found = props.paramValues.find(function (obj) {
                return obj.type === type;
              });

              if (found) {
                return found.slot_value;
              } else {
                return handleDefaultParam(slotValue);
              }
            };

            props.setModal(false);
            props.selection.item.setAttribute('data-type', type);
            props.selection.item.setAttribute('data-slot-value', getParamValues());
            props.mapNodesToModel(document.querySelector('.item--active [contenteditable="true"]').childNodes, props.active);
            props.setSelection(null);
            props.setStateChange(!props.stateChange);
          }
        }, /*#__PURE__*/React__default.createElement("span", {
          role: "img"
        }, "@", item.name));
      });
    }
  };

  if (entities) {
    return /*#__PURE__*/React__default.createElement("div", {
      id: "dropdown-modal",
      className: "dropdown " + (props.modal && 'dropdown--active'),
      ref: modalRef
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "dropdown__search-wrap"
    }, /*#__PURE__*/React__default.createElement(TextInput, {
      Component: "input",
      trigger: "",
      options: entitiesNames,
      spaceRemovers: [],
      matchAny: true,
      onChange: function onChange(e) {
        filterEntities(e);
      },
      ref: input,
      className: "dropdown__search editor-input",
      placeholder: "Filter entities"
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "dropdown__inner"
    }, entities && makeEntities(entities)));
  } else {
    return null;
  }
}

var Input = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Input, _React$Component);

  function Input(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      model: _this.props.model
    };
    _this.text = React__default.createRef('');
    _this.handleSelection = _this.handleSelection.bind(_assertThisInitialized(_this));
    _this.handleModal = _this.handleModal.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Input.prototype;

  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    if (nextProps.utterances.length !== this.props.utterances.length || this.props.stateChange !== nextProps.stateChange || nextProps.active !== this.props.active) {
      return true;
    } else {
      return this.props.model.length === 0;
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    console.log(this.props.active, prevProps.active);

    if (this.props.active !== prevProps.active || this.props.active && !this.text.current.length) {
      this.text.current && this.text.current.focus();
    }
  };

  _proto.handleModal = function handleModal(selection, relativePos) {
    document.querySelector('#dropdown-modal').style.left = relativePos.left + 24 + "px";
    document.querySelector('#dropdown-modal').style.top = relativePos.top + 2 * 24 + "px";
    this.props.setModal(true);
    this.props.setSelection({
      item: selection,
      index: this.props.index
    });
  };

  _proto.handleSelection = function handleSelection(e) {

    var selection = window.getSelection().getRangeAt(0);

    if (selection.toString()) {
      var textNode = document.createTextNode(selection.toString());
      var selectedText = selection.extractContents();
      var span = document.createElement('span');
      var nested = span.querySelectorAll('*');
      span.appendChild(textNode);
      span.setAttribute('class', 'highlight');
      span.textContent = span.textContent.trim();
      selection.insertNode(span);
      e.target.childNodes.forEach(function (child) {
        if (child.dataset && !child.dataset.type && child !== span) {
          child.replaceWith(child.textContent);
        }
      });

      if (span.parentNode.tagName === 'SPAN') {
        span.parentNode.outerHTML = span.parentNode.innerHTML;
      }

      var parentPos = document.querySelector('.convo-details').getBoundingClientRect();
      var childPos = span.getBoundingClientRect();
      var relativePos = {
        top: childPos.top - parentPos.top,
        left: childPos.left - parentPos.left
      };
      this.handleModal(span, relativePos);
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    if (this.props.model) {
      var mappedModel = this.props.model.filter(function (item) {
        return item.text.trim().length;
      });
      mappedModel = this.props.model.map(function (item, index) {
        if (item.type) {
          return "<span data-token=\"true\" style=\"background:" + item.color + "\" data-slot-value=\"" + item.slot_value + "\" data-type=\"" + item.type + "\" class=\"highlight\">" + item.text.trim() + "</span>";
        } else {
          return item.text;
        }
      });

      var disableNewlines = function disableNewlines(evt) {
        var keyCode = evt.keyCode || evt.which;

        if (keyCode === 13) {
          evt.preventDefault();

          _this2.props.focusOnExpressionInput();
        }
      };

      if (this.props.active) {
        return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
          className: "item__input"
        }, /*#__PURE__*/React__default.createElement(ContentEditable, {
          innerRef: this.text,
          html: mappedModel.join(' ') + " ",
          onClick: function onClick(e) {
            if (e.target.getAttribute('data-token')) {
              _this2.handleModal(e.target, e);
            }
          },
          onKeyPress: function onKeyPress(e) {
            disableNewlines(e);
          },
          onMouseUp: function onMouseUp(e) {
            _this2.handleSelection(e);
          },
          onChange: function onChange(e) {
            var nodes = e.currentTarget.childNodes;
            nodes = nodes.forEach(function (item) {
              if (!item.textContent.trim().length && item.tagName === 'SPAN') {
                item.remove();
              }
            });

            _this2.props.mapNodesToModel(e.currentTarget.childNodes, _this2.props.index);
          }
        })));
      } else {
        return /*#__PURE__*/React__default.createElement("div", {
          className: "item__input item__input--readonly"
        }, /*#__PURE__*/React__default.createElement("div", {
          style: {
            opacity: mappedModel.join(' ').trim().length ? '1' : '0.5'
          }
        }, mappedModel.join(' ').trim().length ? reactHtmlParser(mappedModel.join(' ')) : 'Input text'));
      }
    } else {
      return /*#__PURE__*/React__default.createElement("div", null);
    }
  };

  return Input;
}(React__default.Component);

var Utterance = function Utterance(props) {
  var _useState = React.useState(false),
      remove = _useState[0],
      setRemove = _useState[1];

  var _useState2 = React.useState(true),
      valid = _useState2[0],
      setValid = _useState2[1];

  var wrapper = React.useRef(null);
  var removeBtn = React.useRef(null);
  var data = props.data;
  React.useEffect(function () {
    var slotValues = props.data.model.map(function (item) {
      return item.slot_value;
    }).filter(function (item) {
      return item;
    });
    var invalidValues = slotValues.filter(function (item) {
      return !item.match(/^[A-Za-z](_*[A-Za-z])*_*$/);
    });
    var term = props.data.model.map(function (item) {
      return item.text;
    }).join(' ');
    var reg = /^[a-zA-Z][a-zA-Z\s]*$/;

    if (reg.test(term) && !invalidValues.length) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [props.data.model]);
  return /*#__PURE__*/React__default.createElement("li", {
    "data-valid": "" + valid,
    ref: wrapper,
    key: data.index,
    className: "item item--intent " + (data.active ? 'item--active' : '') + " " + (remove ? 'item--remove' : '') + " " + (valid ? 'item--valid' : 'item--error'),
    onClick: function onClick() {
      data.handleActive(data.index);
    }
  }, !valid && /*#__PURE__*/React__default.createElement("legend", {
    "class": "item__error"
  }, "Utterances shall begin with alphabetic characters from a to Z. The untterance may not contain other characters then alphabetic characters. The utterance shall not contain any numbers at all."), /*#__PURE__*/React__default.createElement("div", {
    className: "item__main"
  }, /*#__PURE__*/React__default.createElement(Input, {
    model: data.model,
    index: data.index,
    utterances: data.utterances,
    setUtterances: data.setUtterances,
    modal: data.modal,
    setModal: data.setModal,
    setSelection: data.setSelection,
    selection: data.selection,
    mapNodesToModel: data.mapNodesToModel,
    active: data.active,
    addNewValue: data.addNewValue,
    stateChange: data.stateChange,
    focusOnExpressionInput: data.focusOnExpressionInput,
    wrapper: wrapper
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "item__buttons"
  }, /*#__PURE__*/React__default.createElement("button", {
    className: "btn--remove btn--remove--main",
    type: "button",
    ref: removeBtn,
    onClick: function onClick(e) {
      e.stopPropagation();
      setRemove(true);
      setTimeout(function () {
        data.removeFromUtterances(data.index);
        setRemove(false);
      }, 220);
    }
  }, /*#__PURE__*/React__default.createElement(IconTrash, null)))), data.model && data.model.filter(function (item) {
    return item.type;
  }).length ? /*#__PURE__*/React__default.createElement("ul", {
    className: "model",
    style: {
      display: "" + (data.active ? 'block' : 'none')
    }
  }, /*#__PURE__*/React__default.createElement("header", null, /*#__PURE__*/React__default.createElement("div", null, "Parameter Name"), /*#__PURE__*/React__default.createElement("div", null, "Entity"), /*#__PURE__*/React__default.createElement("div", null, "Resolved Value")), data.model.map(function (item, i) {
    if (item.type) {
      var slotValue = item.slot_value;
      var type = item.type;
      return /*#__PURE__*/React__default.createElement("li", {
        key: i
      }, /*#__PURE__*/React__default.createElement("input", {
        className: "editor-input",
        type: "text",
        defaultValue: slotValue,
        onChange: function onChange(e) {
          var arr = [].concat(data.utterances);
          arr[data.index].model[i].slot_value = e.target.value;
          data.setUtterances(arr);
        },
        placeholder: "Set parameter name"
      }), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", {
        className: "highlight",
        style: {
          background: item.color
        }
      }, type)), /*#__PURE__*/React__default.createElement("div", null, item.text), /*#__PURE__*/React__default.createElement("div", {
        className: "item__buttons"
      }, /*#__PURE__*/React__default.createElement("button", {
        className: "btn--remove",
        onClick: function onClick(e) {
          e.preventDefault(e);
          data.removeFromModel(data.index, i);
          data.setStateChange(!data.stateChange);
        }
      }, /*#__PURE__*/React__default.createElement(IconTrash, null))));
    }
  })) : /*#__PURE__*/React__default.createElement(React__default.Fragment, null));
};

var List = React__default.memo(function List(props) {
  var _useState = React.useState(false),
      modal = _useState[0],
      setModal = _useState[1];

  var _useState2 = React.useState(null),
      modalPosition = _useState2[0],
      setModalPosition = _useState2[1];

  var _useState3 = React.useState(null),
      selection = _useState3[0],
      setSelection = _useState3[1];

  var _useState4 = React.useState(false),
      update = _useState4[0],
      setUpdate = _useState4[1];

  var _useState5 = React.useState(false),
      stateChange = _useState5[0],
      setStateChange = _useState5[1];

  var _useState6 = React.useState(null),
      paramValues = _useState6[0],
      setParamValues = _useState6[1];
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

  var handleActive = function handleActive(index) {
    props.setActive(index);
  };

  var mapNodesToModel = function mapNodesToModel(items, index) {
    var arr = Array.from(items).filter(function (item) {
      return item.textContent.trim().length;
    });
    arr = arr.map(function (item) {
      if (item.tagName === 'SPAN' || item.nodeName === '#text' && item.textContent.trim().length) {
        var type = item.dataset && item.dataset.type && item.dataset.type.length ? item.dataset.type : null;

        if (type) {
          return {
            text: item.textContent.trim(),
            type: type,
            slot_value: item.dataset.slotValue
          };
        } else {
          return {
            text: item.textContent.trim()
          };
        }
      } else {
        return null;
      }
    });
    arr = arr.filter(function (item) {
      return item;
    });
    console.log('arr', arr);
    var values = [].concat(props.utterances);
    values[index] = {
      raw: arr.map(function (item) {
        return item.text;
      }).join(' '),
      model: arr
    };
    props.setUtterances(values);
  };

  var makeItems = function makeItems(items) {
    return items.map(function (item, index) {
      var model = item.model.map(function (val) {
        return _extends({}, val, {
          color: getColor(val.text.length)
        });
      });
      var data = {
        index: index,
        active: index === props.active,
        model: model,
        utterances: props.utterances,
        setUtterances: props.setUtterances,
        handleActive: handleActive,
        modal: modal,
        setModal: setModal,
        setModalPosition: setModalPosition,
        selection: selection,
        setSelection: setSelection,
        addNewValue: props.addNewValue,
        stateChange: stateChange,
        setStateChange: setStateChange,
        removeFromUtterances: removeFromUtterances,
        removeFromModel: props.removeFromModel,
        mapNodesToModel: mapNodesToModel,
        focusOnExpressionInput: props.focusOnExpressionInput
      };
      return /*#__PURE__*/React__default.createElement(Utterance, {
        key: index,
        data: data,
        errors: props.errors
      });
    });
  };

  var removeFromUtterances = function removeFromUtterances(index) {
    var arr = [].concat(props.utterances);

    if (index !== -1) {
      arr.splice(index, 1);
      console.log('new arr after delete', arr);
      props.setUtterances(arr);
      props.setActive(null);
    }
  };

  console.log(selection);

  if (props.utterances) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("ul", null, makeItems(props.utterances)), /*#__PURE__*/React__default.createElement(Modal, {
      setModal: setModal,
      modal: modal,
      modalPosition: modalPosition,
      selection: selection,
      setSelection: setSelection,
      active: props.active,
      utterances: props.utterances,
      setUtterances: props.setUtterances,
      setUpdate: setUpdate,
      update: update,
      mapNodesToModel: mapNodesToModel,
      stateChange: stateChange,
      setStateChange: setStateChange,
      entities: props.entities.flat(),
      paramValues: paramValues,
      setParamValues: setParamValues
    }));
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

  var _useState6 = React.useState(true),
      nameValid = _useState6[0],
      setNameValid = _useState6[1];

  var newExpressionInput = React.useRef(null);
  var errors = Array.from(document.querySelectorAll('[data-valid="false"]'));

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
    console.log('errors --->', errors.length < 1);

    if (name && utterances) {
      props.onUpdate(_extends({}, intent, {
        name: name,
        utterances: utterances
      }), errors.length < 1);
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
      "data-valid": "" + nameValid,
      type: "text",
      defaultValue: name ? name : '',
      placeholder: "Intent name",
      className: "editor-input input--item-name",
      onChange: function onChange(e) {
        var message = 'Intent names shall begin with alphabetic characters from a to Z. The intent name may contain 1 underscore per word. Intent names shall not contain any numbers at all.';
        var valid = validateInput(e.target, e.target.value, '^[A-Za-z](_?[A-Za-z])*_?$', message);
        setNameValid(valid);
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
      focusOnExpressionInput: focusOnExpressionInput,
      errors: errors
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
var EntitiyEditor = function EntitiyEditor(props) {
  return /*#__PURE__*/React__default.createElement(EntityDetails, {
    entity: props.entity,
    onUpdate: props.onUpdate
  });
};

exports.EntitiyEditor = EntitiyEditor;
exports.IntentEditor = IntentEditor;
//# sourceMappingURL=index.js.map
