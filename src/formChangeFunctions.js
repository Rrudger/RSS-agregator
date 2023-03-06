function isValid (inputEl, warningEl) {
  warningEl.classList.add('invisible');
  inputEl.classList.remove('is-invalid');
  inputEl.classList.add('is-valid');
  inputEl.value = '';
}

function isInvalid (inputEl, warningEl) {
  warningEl.classList.remove('invisible');
  warningEl.textContent = 'Ссылка должна быть валидным URL';
  inputEl.classList.remove('is-valid');
  inputEl.classList.add('is-invalid');
}

function existsLink (inputEl, warningEl) {
  warningEl.classList.remove('invisible');
  warningEl.textContent = 'RSS уже существует';
  inputEl.classList.remove('is-valid');
  inputEl.classList.add('is-invalid');
}

const changeForm = {
  valid: isValid,
  invalid: isInvalid,
  exists: existsLink,
};

export default changeForm;
