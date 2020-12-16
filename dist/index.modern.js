import React, { useState, useRef, useEffect } from 'react';
import 'lodash';
import useOnclickOutside from 'react-cool-onclickoutside';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import ContentEditable from 'react-contenteditable';
import reactHtmlParser from 'react-html-parser';

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

const getColor = index => {
  let arr = ["#56ebd3", "#fbacf6", "#9ee786", "#e4b5ff", "#c2e979", "#20d8fd", "#e8d25c", "#42edec", "#f3c46f", "#5cefba", "#e8de7a", "#7ee8c0", "#e8d98c", "#88e99a", "#cfdd73", "#8be8ad", "#dff799", "#b5eaa1", "#c2d681", "#b5e287"];
  return arr[index % arr.length];
};

function Modal(props) {
  const [entities, setEntities] = useState(props.entities);
  const [allEntities, setAllEntities] = useState(props.entities);
  const [entitiesNames, setEntitiesNames] = useState([]);
  const input = useRef();
  const modalRef = useOnclickOutside(() => {
    props.setModal(false);
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

  const makeEntities = items => {
    const handleDefaultParam = param => {
      if (param.includes('.')) {
        return param.split('.').pop();
      } else {
        return param.split('@').pop();
      }
    };

    if (items) {
      return items.map((item, i) => {
        return /*#__PURE__*/React.createElement("button", {
          key: i,
          onClick: e => {
            e.preventDefault();
            let type = '@' + item.name;
            let slotValue = item.name;

            const getParamValues = () => {
              let found = props.paramValues.find(obj => obj.type === type);

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
        }, /*#__PURE__*/React.createElement("span", {
          role: "img"
        }, "@", item.name));
      });
    }
  };

  if (entities) {
    return /*#__PURE__*/React.createElement("div", {
      id: "dropdown-modal",
      className: `dropdown ${props.modal && 'dropdown--active'}`,
      ref: modalRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "dropdown__search-wrap"
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
    })), /*#__PURE__*/React.createElement("div", {
      className: "dropdown__inner"
    }, entities && makeEntities(entities)));
  } else {
    return null;
  }
}

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: this.props.model
    };
    this.text = React.createRef('');
    this.handleSelection = this.handleSelection.bind(this);
    this.handleModal = this.handleModal.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.utterances.length !== this.props.utterances.length || this.props.stateChange !== nextProps.stateChange || nextProps.active !== this.props.active) {
      return true;
    } else {
      return this.props.model.length === 0;
    }
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.active, prevProps.active);

    if (this.props.active !== prevProps.active || this.props.active && !this.text.current.length) {
      this.text.current && this.text.current.focus();
    }
  }

  handleModal(selection, relativePos) {
    document.querySelector('#dropdown-modal').style.left = `${relativePos.left + 24}px`;
    document.querySelector('#dropdown-modal').style.top = `${relativePos.top + 2 * 24}px`;
    this.props.setModal(true);
    this.props.setSelection({
      item: selection,
      index: this.props.index
    });
  }

  handleSelection(e) {

    let selection = window.getSelection().getRangeAt(0);

    if (selection.toString()) {
      let textNode = document.createTextNode(selection.toString());
      let selectedText = selection.extractContents();
      let span = document.createElement('span');
      let nested = span.querySelectorAll('*');
      span.appendChild(textNode);
      span.setAttribute('class', 'highlight');
      span.textContent = span.textContent.trim();
      selection.insertNode(span);
      e.target.childNodes.forEach(child => {
        if (child.dataset && !child.dataset.type && child !== span) {
          child.replaceWith(child.textContent);
        }
      });

      if (span.parentNode.tagName === 'SPAN') {
        span.parentNode.outerHTML = span.parentNode.innerHTML;
      }

      let parentPos = document.querySelector('.convo-details').getBoundingClientRect();
      let childPos = span.getBoundingClientRect();
      let relativePos = {
        top: childPos.top - parentPos.top,
        left: childPos.left - parentPos.left
      };
      this.handleModal(span, relativePos);
    }
  }

  render() {
    if (this.props.model) {
      let mappedModel = this.props.model.filter(item => item.text.trim().length);
      mappedModel = this.props.model.map((item, index) => {
        if (item.type) {
          return `<span data-token="true" style="background:${item.color}" data-slot-value="${item.slot_value}" data-type="${item.type}" class="highlight">${item.text.trim()}</span>`;
        } else {
          return item.text;
        }
      });

      const disableNewlines = evt => {
        const keyCode = evt.keyCode || evt.which;

        if (keyCode === 13) {
          evt.preventDefault();
          this.props.focusOnExpressionInput();
        }
      };

      if (this.props.active) {
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
          className: "item__input"
        }, /*#__PURE__*/React.createElement(ContentEditable, {
          innerRef: this.text,
          html: `${mappedModel.join(' ')} `,
          onClick: e => {
            if (e.target.getAttribute('data-token')) {
              this.handleModal(e.target, e);
            }
          },
          onKeyPress: e => {
            disableNewlines(e);
          },
          onMouseUp: e => {
            this.handleSelection(e);
          },
          onChange: e => {
            let nodes = e.currentTarget.childNodes;
            nodes = nodes.forEach(item => {
              if (!item.textContent.trim().length && item.tagName === 'SPAN') {
                item.remove();
              }
            });
            this.props.mapNodesToModel(e.currentTarget.childNodes, this.props.index);
          }
        })));
      } else {
        return /*#__PURE__*/React.createElement("div", {
          className: "item__input item__input--readonly"
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            opacity: mappedModel.join(' ').trim().length ? '1' : '0.5'
          }
        }, mappedModel.join(' ').trim().length ? reactHtmlParser(mappedModel.join(' ')) : 'Input text'));
      }
    } else {
      return /*#__PURE__*/React.createElement("div", null);
    }
  }

}

const Utterance = props => {
  const [remove, setRemove] = useState(false);
  const [valid, setValid] = useState(true);
  const wrapper = useRef(null);
  const removeBtn = useRef(null);
  let data = props.data;
  useEffect(() => {
    let slotValues = props.data.model.map(item => item.slot_value).filter(item => item);
    let invalidValues = slotValues.filter(item => !item.match(/^[A-Za-z](_*[A-Za-z])*_*$/));
    let term = props.data.model.map(item => item.text).join(' ');
    let reg = /^[a-zA-Z][a-zA-Z\s]*$/;

    if (reg.test(term) && !invalidValues.length) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [props.data.model]);
  return /*#__PURE__*/React.createElement("li", {
    "data-valid": `${valid}`,
    ref: wrapper,
    key: data.index,
    className: `item item--intent ${data.active ? 'item--active' : ''} ${remove ? 'item--remove' : ''} ${valid ? 'item--valid' : 'item--error'}`,
    onClick: () => {
      data.handleActive(data.index);
    }
  }, !valid && /*#__PURE__*/React.createElement("legend", {
    className: "item__error"
  }, "Utterances shall begin with alphabetic characters from a to Z. The untterance may not contain other characters then alphabetic characters. The utterance shall not contain any numbers at all."), /*#__PURE__*/React.createElement("div", {
    className: "item__main"
  }, /*#__PURE__*/React.createElement(Input, {
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
  }), /*#__PURE__*/React.createElement("div", {
    className: "item__buttons"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn--remove btn--remove--main",
    type: "button",
    ref: removeBtn,
    onClick: e => {
      e.stopPropagation();
      setRemove(true);
      setTimeout(() => {
        data.removeFromUtterances(data.index);
        setRemove(false);
      }, 220);
    }
  }, /*#__PURE__*/React.createElement(IconTrash, null)))), data.model && data.model.filter(item => item.type).length ? /*#__PURE__*/React.createElement("ul", {
    className: "model",
    style: {
      display: `${data.active ? 'block' : 'none'}`
    }
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("div", null, "Parameter Name"), /*#__PURE__*/React.createElement("div", null, "Entity"), /*#__PURE__*/React.createElement("div", null, "Resolved Value")), data.model.map((item, i) => {
    if (item.type) {
      let slotValue = item.slot_value;
      let type = item.type;
      return /*#__PURE__*/React.createElement("li", {
        key: i
      }, /*#__PURE__*/React.createElement("input", {
        className: "editor-input",
        type: "text",
        defaultValue: slotValue,
        onChange: e => {
          let arr = [...data.utterances];
          arr[data.index].model[i].slot_value = e.target.value;
          data.setUtterances(arr);
        },
        placeholder: "Set parameter name"
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "highlight",
        style: {
          background: item.color
        }
      }, type)), /*#__PURE__*/React.createElement("div", null, item.text), /*#__PURE__*/React.createElement("div", {
        className: "item__buttons"
      }, /*#__PURE__*/React.createElement("button", {
        className: "btn--remove",
        onClick: e => {
          e.preventDefault(e);
          data.removeFromModel(data.index, i);
          data.setStateChange(!data.stateChange);
        }
      }, /*#__PURE__*/React.createElement(IconTrash, null))));
    }
  })) : /*#__PURE__*/React.createElement(React.Fragment, null));
};

const List = React.memo(function List(props) {
  const [modal, setModal] = useState(false);
  const [modalPosition, setModalPosition] = useState(null);
  const [selection, setSelection] = useState(null);
  const [update, setUpdate] = useState(false);
  const [stateChange, setStateChange] = useState(false);
  const [paramValues, setParamValues] = useState(null);
  useEffect(() => {
    let arr = props.utterances.map(item => item.model).flat().filter(item => item.slot_value).map(item => ({
      type: item.type,
      slot_value: item.slot_value
    }));
    let uniq = arr.filter((v, i, a) => a.findIndex(t => t.slot_value === v.slot_value) === i);
    setParamValues(uniq);
  }, [props.utterances]);

  const handleActive = index => {
    props.setActive(index);
  };

  const mapNodesToModel = (items, index) => {
    let arr = Array.from(items).filter(item => item.textContent.trim().length);
    arr = arr.map(item => {
      if (item.tagName === 'SPAN' || item.nodeName === '#text' && item.textContent.trim().length) {
        let type = item.dataset && item.dataset.type && item.dataset.type.length ? item.dataset.type : null;

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
    arr = arr.filter(item => item);
    console.log('arr', arr);
    let values = [...props.utterances];
    values[index] = {
      raw: arr.map(item => item.text).join(' '),
      model: arr
    };
    props.setUtterances(values);
  };

  const makeItems = items => {
    return items.map((item, index) => {
      let model = item.model.map(val => {
        return { ...val,
          color: getColor(val.text.length)
        };
      });
      let data = {
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
      return /*#__PURE__*/React.createElement(Utterance, {
        key: index,
        data: data,
        errors: props.errors
      });
    });
  };

  const removeFromUtterances = index => {
    let arr = [...props.utterances];

    if (index !== -1) {
      arr.splice(index, 1);
      console.log('new arr after delete', arr);
      props.setUtterances(arr);
      props.setActive(null);
    }
  };

  console.log(selection);

  if (props.utterances) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("ul", null, makeItems(props.utterances)), /*#__PURE__*/React.createElement(Modal, {
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
  const [intent, setIntent] = useState(props.intent);
  const entities = props.entities;
  const systemEntities = props.systemEntities;
  const [name, setName] = useState('');
  const [utterances, setUtterances] = useState([]);
  const [active, setActive] = useState(null);
  const [newExpression, setNewExpression] = useState(null);
  const [nameValid, setNameValid] = useState(true);
  const newExpressionInput = useRef(null);
  let errors = Array.from(document.querySelectorAll('[data-valid="false"]'));

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

  const removeFromModel = (utteranceIndex, index) => {
    let arr = [...utterances];
    let model = arr[utteranceIndex].model;
    model[index] = {
      text: model[index].text
    };
    setUtterances(arr);
  };

  useEffect(() => {
    if (intent) {
      setName(intent.name);
      setUtterances(intent.utterances);
    }
  }, [intent]);
  useEffect(() => {
    console.log('errors --->', errors.length < 1);

    if (name && utterances) {
      props.onUpdate({ ...intent,
        name: name,
        utterances: utterances
      }, errors.length < 1);
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
      "data-valid": `${nameValid}`,
      type: "text",
      defaultValue: name ? name : '',
      placeholder: "Intent name",
      className: "editor-input input--item-name",
      onChange: e => {
        let message = 'Intent names shall begin with alphabetic characters from a to Z. The intent name may contain 1 underscore per word. Intent names shall not contain any numbers at all.';
        let valid = validateInput(e.target, e.target.value, '^[A-Za-z](_?[A-Za-z])*_?$', message);
        setNameValid(valid);
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
      active: active,
      setActive: setActive,
      utterances: utterances,
      setUtterances: setUtterances,
      removeFromModel: removeFromModel,
      entities: [entities, ...systemEntities],
      focusOnExpressionInput: focusOnExpressionInput,
      errors: errors
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
