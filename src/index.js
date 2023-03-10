//import "./scss/test.scss"

import "../node_modules/bootstrap/scss/bootstrap.scss";

import onChange from 'on-change';
import * as yup from 'yup';
import {changeFormStatus, createCard, renderFeed, renderPost} from './formChangeFunctions.js';
import axios from 'axios';


const schema = yup.string().required().url();

const form = document.getElementsByClassName('rss-form')[0];
const formInput = document.getElementById('url-input');
const warninig = document.getElementsByClassName('feedback')[0];

let linkList = [];
import i18n from 'i18next';
import resources from './locales/ru.js';

const i18nInstance = i18n.createInstance();
i18nInstance
    .init({
      lng: 'ru',
      debug: true,
      resources: {
        ru: {
          translation: resources.translation
        }
      },
    });


const state = {
    validateStatus: 'neutral',
  };

const resetForm = () => changeFormStatus(watchedState.validateStatus, i18nInstance);
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


fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent('https://ru.hexlet.io/lessons.rss')}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(data => {
    const feedCard = document.getElementsByClassName('feeds')[0];
    const postsCard = document.getElementsByClassName('posts')[0];
    if (feedCard.children.length === 0) {
      feedCard.append(createCard(i18nInstance.t('cards.feeds')));
      postsCard.append(createCard(i18nInstance.t('cards.posts')));
    }

    const parser = new DOMParser();
    const chanel = parser.parseFromString(data.contents, "application/xml");
    feedCard.getElementsByTagName('ul')[0].append(renderFeed(chanel))
    const posts = chanel.getElementsByTagName('item');
    [...posts].forEach((post) => {
      console.log(post);
      postsCard.getElementsByTagName('ul')[0].append(renderPost(post))
    })



  });
