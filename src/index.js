//import "./scss/test.scss"

import "../node_modules/bootstrap/scss/bootstrap.scss";

import onChange from 'on-change';
import * as yup from 'yup';
import formFunctions from './formChangeFunctions.js';

const schema = yup.string().required().url();

const form = document.getElementsByClassName('rss-form')[0];
const formInput = document.getElementById('url-input');
const warninig = document.getElementsByClassName('feedback')[0];

let linkList = [];

form.addEventListener("submit", validateFunc);

function validateFunc (e) {
  e.preventDefault();
  const link = formInput.value;

  linkList.includes(link) ? formFunctions['exists'](formInput, warninig) : schema
  .validate(formInput.value)
  .then(function() {
    formFunctions['valid'](formInput, warninig);
    linkList = [link, ...linkList];
})
  .catch(function(err) {
    formFunctions['invalid'](formInput, warninig);
});
}
