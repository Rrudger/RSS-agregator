import 'bootstrap/scss/bootstrap.scss';

import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import resources from './locales/ru.js';
import {
  changeFormStatus,
  createCard,
  renderFeed,
  renderPost,
} from './formChangeFunctions.js';

const schema = yup.string().required().url();
const form = document.getElementsByClassName('rss-form')[0];
const formInput = document.getElementById('url-input');
let linkList = [];
const i18nInstance = i18n.createInstance();
i18nInstance
  .init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: resources.translation,
      },
    },
  });

const state = {
  validateStatus: 'neutral',
};

const watchedState = onChange(state, () => {
  changeFormStatus(watchedState.validateStatus, i18nInstance);
});

function dataParser(validUrl) {
  fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(validUrl)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      const feedCard = document.getElementsByClassName('feeds')[0];
      const postsCard = document.getElementsByClassName('posts')[0];
      if (feedCard.children.length === 0) {
        feedCard.append(createCard(i18nInstance.t('cards.feeds')));
        postsCard.append(createCard(i18nInstance.t('cards.posts')));
      }

      const parser = new DOMParser();
      const chanel = parser.parseFromString(data.contents, 'application/xml');
      feedCard.getElementsByTagName('ul')[0].prepend(renderFeed(chanel));
      const posts = chanel.getElementsByTagName('item');
      [...posts].forEach((post) => {
        console.log(post);
        postsCard.getElementsByTagName('ul')[0].prepend(renderPost(post));
      });
    });
}

function validateFunc(e) {
  e.preventDefault();
  const link = formInput.value;

  if (linkList.includes(link)) {
    watchedState.validateStatus = 'exists';
  } else {
    schema
      .validate(formInput.value)
      .then(() => {
        watchedState.validateStatus = 'valid';
        linkList = [link, ...linkList];
        dataParser(link);
      })
      .catch(() => {
        watchedState.validateStatus = 'invalid';
      });
  }
}

form.addEventListener('submit', validateFunc);
