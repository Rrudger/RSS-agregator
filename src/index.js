import './scss/custom.scss';

import Modal from 'bootstrap/js/src/modal';
import {
  uniqueId,
  difference,
} from 'lodash';
import axios from 'axios';
import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import resources from './locales/ru.js';
import {
  changeFormStatus,
  markViewedPost,
  createCard,
  renderFeed,
  renderPost,
} from './formChangeFunctions.js';

const schema = yup.string().required().url();
const form = document.getElementsByClassName('rss-form')[0];
const formInput = document.getElementById('url-input');
const modal = document.getElementById('modal');
let linkList = [];
const descriptionsLinksList = new Map();
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
  viewedPost: '',
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'validateStatus':
      changeFormStatus(value, i18nInstance);
      break;
    case 'viewedPosts':
      markViewedPost(value);
      break;
    default:
  }
});

const parserFunc = (data) => {
  const parser = new DOMParser();
  return new Promise((resolve, reject) => {
    const chanel = parser.parseFromString(data, 'application/xml');

    const errorNode = chanel.querySelector('parsererror');
    if (errorNode) {
      watchedState.validateStatus = 'loadError';
      reject();
    } else {
      resolve(chanel);
    }
  });
};

const btnViewClick = (e) => {
  e.preventDefault();
  if (e.target.textContent === i18nInstance.t('buttons.view')) {
    watchedState.viewedPosts = e.target.parentNode.id;
    const myModal = new Modal(document.getElementById('modal'), {
      keyboard: false,
    });
    modal.getElementsByTagName('h5')[0].textContent = e.target.parentNode.getElementsByTagName('a')[0].textContent;
    const postData = descriptionsLinksList.get(e.target.parentNode.getElementsByTagName('a')[0].textContent.trim());
    modal.getElementsByClassName('modal-body')[0].textContent = postData.desctiption;
    modal.getElementsByClassName('full-article')[0].href = postData.link;
    myModal.show();
  }
};

const fillPostsCard = (chanel, id) => {
  const card = document.getElementsByClassName('posts')[0]
    .getElementsByTagName('ul')[0];
  const posts = chanel.getElementsByTagName('item');
  const firstItem = [...posts].slice(0, 1)[0];
  let link = firstItem.getElementsByTagName('link')[0].textContent.trim();
  let title = firstItem.getElementsByTagName('title')[0].textContent.trim();
  let desctiption = firstItem.getElementsByTagName('description')[0].textContent.trim();
  let prevPost = renderPost(link, title, id, i18nInstance);
  descriptionsLinksList.set(title, { desctiption, link });
  prevPost.addEventListener('click', btnViewClick);
  card.prepend(prevPost);
  [...posts].slice(1).forEach((post) => {
    link = post.getElementsByTagName('link')[0].textContent.trim();
    title = post.getElementsByTagName('title')[0].textContent.trim();
    desctiption = post.getElementsByTagName('description')[0].textContent.trim();
    descriptionsLinksList.set(title, { desctiption, link });
    const newPost = renderPost(link, title, id, i18nInstance);
    prevPost.after(newPost);
    prevPost = newPost;
    prevPost.addEventListener('click', btnViewClick);
  });
};

const createChanell = (chanel, url) => {
  const feedCard = document.getElementsByClassName('feeds')[0];
  const postsCard = document.getElementsByClassName('posts')[0];
  if (feedCard.children.length === 0) {
    feedCard.append(createCard(i18nInstance.t('cards.feeds')));
    postsCard.append(createCard(i18nInstance.t('cards.posts')));
  }

  const id = uniqueId('feed_');

  feedCard.getElementsByTagName('ul')[0].prepend(renderFeed(chanel, id, url));
  fillPostsCard(chanel, id);
};

function urlProcessing(validUrl) {
  axios
    .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(validUrl)}&disableCache=1`)
    .catch(() => {
      watchedState.validateStatus = 'reteError';
    })
    .then((response) => parserFunc(response.data.contents))
    .then((chanel) => {
      if (!chanel) {
        watchedState.validateStatus = 'loadError';
      } else {
        watchedState.validateStatus = 'valid';
        linkList = [validUrl, ...linkList];
        createChanell(chanel, validUrl);
        form.reset();
      }
    });
}

function initFunc(e) { // проверяет валидность урл добавляет в список
  e.preventDefault();
  const link = formInput.value;
  if (linkList.includes(link)) {
    watchedState.validateStatus = 'exists';
  } else {
    schema
      .validate(link)
      .then(() => {
        urlProcessing(link);
        return true;
      })
      .catch(() => {
        watchedState.validateStatus = 'invalid';
      });
  }
}

function checkFeeds() {
  const feeds = document.getElementsByClassName('feeds')[0].getElementsByTagName('li');
  [...feeds].forEach((feed) => {
    const postsList = [...document.getElementsByClassName('posts')[0]
      .getElementsByTagName('li')]
      .filter((listItem) => listItem.getAttribute('feed-id') === feed.id);
    const postsTitles = postsList.map((post) => post.getElementsByTagName('a')[0].textContent.trim());
    axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(feed.getAttribute('url-chanel'))}&disableCache=1`)
      .catch()
      .then((response) => parserFunc(response.data.contents))
      .then((chanel) => {
        if (chanel) {
          const loadedPosts = [...chanel.getElementsByTagName('item')]
            .map((item) => item.getElementsByTagName('title')[0].textContent.trim());
          const diff = difference(loadedPosts, postsTitles);
          if (diff.length !== 0) {
            const newPosts = [...chanel.getElementsByTagName('item')]
              .filter((item) => item.textContent.includes(diff[0]));
            [...newPosts].forEach((post) => {
              const card = document.getElementsByClassName('posts')[0].getElementsByTagName('ul')[0];
              const newPost = renderPost(post, feed.id, i18nInstance);
              newPost.addEventListener('click', btnViewClick);
              card.prepend(newPost);
            });
          }
        }
      });
  });
}

form.addEventListener('submit', initFunc);
const timeOutFunc = () => {
  setTimeout(() => {
    timeOutFunc();
    checkFeeds();
  }, 5000);
};

timeOutFunc();
