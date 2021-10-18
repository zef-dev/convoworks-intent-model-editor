import React, { useRef, useEffect, useState } from 'react';
import rangy from 'rangy';
import ContentEditable from 'react-contenteditable'
import { getCaretCharacterOffsetWithin, stringToColor, setCaretPosition } from '../../../helpers/common_constants'
import Dropdown from '../Dropdown'
import sanitizeHtml from 'sanitize-html';

const UtteranceInput = (props) => {

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

  const tagSelection = (type) => {
    if (props.selection) {
      if (!props.selection.tagName) {

        const getSlotValue = (type) => {
          let existingSlotValue = props.slotValuePairs.find(item => item.type === type);
          if (existingSlotValue) {
            return existingSlotValue.slot_value
          } else {
            let arr = type.split('.');
            let str = arr[arr.length - 1];
            return str;
          }
        }

        let mark = createNode(type, getSlotValue(type), props.selection.toString());
        if (mark) {
          props.selection.getRangeAt(0).extractContents();
          props.selection.getRangeAt(0).insertNode(mark);

          if (mark.parentElement.tagName === "MARK") {
            mark.parentElement.replaceWith(...mark.parentElement.childNodes);
            mark.innerHTML = mark.textContent.trim();
          }

          input.current.childNodes.forEach((item) => {
            if (item.tagName === "MARK") {
              if (item.innerHTML.slice(-1).includes(' ')) {
                item.innerHTML = item.innerHTML.trim();
              }
            }
          })
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
  }

  const handleSelection = () => {
    var sel
    // Check for existence of window.getSelection() and that it has a
    // modify() method. IE 9 has both selection APIs but no modify() method.
    if (window.getSelection && (sel = window.getSelection()).modify) {
      sel = window.getSelection()
      if (!sel.isCollapsed) {
        // Detect if selection is backwards
        var range = document.createRange()
        range.setStart(sel.anchorNode, sel.anchorOffset)
        range.setEnd(sel.focusNode, sel.focusOffset)
        var backwards = range.collapsed
        range.detach()

        // modify() works on the focus of the selection
        var endNode = sel.focusNode,
          endOffset = sel.focusOffset
        sel.collapse(sel.anchorNode, sel.anchorOffset)

        var direction = []
        if (backwards) {
          direction = ['backward', 'forward']
        } else {
          direction = ['forward', 'backward']
        }

        sel.modify('move', direction[0], 'character')
        sel.modify('move', direction[1], 'word')
        sel.extend(endNode, endOffset)
        sel.modify('extend', direction[1], 'character')
        sel.modify('extend', direction[0], 'word')
      }
    }

    /* 
    SET CURRENT SELECTION
    */
    if (sel.toString().length > 0) {
      let sel = rangy.getSelection()
      props.setSelection(sel)
    } else {
      props.setSelection(null);
    }
  }

  useEffect(() => {
    let s = window.getSelection();

    if (s && s.rangeCount > 0) {
      let oRange = s.getRangeAt(0); //get the text range
      let oRect = oRange.getBoundingClientRect();

      setDropdownState({
        position: oRect.x / 2,
        active: props.selection !== null
      })
    } else {
      setDropdownState({ ...dropdownState, active: false });
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
      props.handleNew();
      setKeyPress('');
    }
  }, [keyPress])
  return (
    <div className='taggable-text'>
      <ContentEditable
        data-placeholder="Enter reference value"
        innerRef={input}
        className='taggable-text__input'
        html={sanitized}
        onClick={(e) => {
          if (e.target.tagName === 'MARK') {
            props.setSelection(e.target);
          }
        }}
        onChange={(e) => {
          props.setRaw(e.target.value);
          cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
        }}
        onMouseUp={() => {
          handleSelection();
          cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
        }}

        onKeyDown={(e) => {
          if (e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38) {
            setKeyPress(e.keyCode);
            e.preventDefault();
          }
        }}
        onKeyUp={(e) => {
          handleSelection();
          cursorPosition.current = getCaretCharacterOffsetWithin(input.current);
        }}
        onFocus={() => {
          props.setActive(props.index)
        }}
      />
      {props.active && <Dropdown dropdownState={dropdownState} entities={props.entities} selection={props.selection} setSelection={props.setSelection} tagSelection={tagSelection} />}
    </div>
  )
}

export default React.memo(UtteranceInput);