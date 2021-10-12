export const validateInput = (elem, term, regex, message) => {
  let reg = new RegExp(regex);
  if (reg.test(term)) {
    elem.setCustomValidity('');
  } else {
    elem.setCustomValidity(message);
  }
  elem.reportValidity();

  return reg.test(term);
};

export const simpleValidateInput = (term, regex) => {
  let reg = new RegExp(regex);
  return reg.test(term); 
}