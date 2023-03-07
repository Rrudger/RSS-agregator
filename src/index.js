//import "./scss/test.scss"

import "../node_modules/bootstrap/scss/bootstrap.scss";

import onChange from 'on-change';
import * as yup from 'yup';
import formReset from './formChangeFunctions.js';

const schema = yup.string().required().url();

const form = document.getElementsByClassName('rss-form')[0];
const formInput = document.getElementById('url-input');
const warninig = document.getElementsByClassName('feedback')[0];

let linkList = [];



const state = {
    validateStatus: 'neutral',
  };

const resetForm = () => formReset(watchedState.validateStatus, formInput, warninig);
const watchedState = onChange(state, resetForm);

form.addEventListener("submit", validateFunc);

function validateFunc (e) {
  e.preventDefault();
  const link = formInput.value;

  linkList.includes(link) ? watchedState.validateStatus = 'exists' : schema
  .validate(formInput.value)
  .then(function() {
    watchedState.validateStatus = 'valid';
    linkList = [link, ...linkList];
})
  .catch(function(err) {
    watchedState.validateStatus = 'invalid';
});
}
