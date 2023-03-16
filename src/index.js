//import 'bootstrap/scss/bootstrap.scss';
import './scss/custom.scss';
import 'bootstrap/js/dist/modal';
//import 'bootstrap/dist/js/bootstrap.js';


import {
  uniqueId,
  difference
} from 'lodash';
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

const parserFunc = (data) => {
  const parser = new DOMParser();
  return new Promise(function(resolve, reject) {
    const chanel = parser.parseFromString(data, 'application/xml');
    const errorNode = chanel.querySelector("parsererror");
    if (errorNode) {
      reject(err)
    } else {
      resolve(chanel)
    }
  })
}

const fillPostsCard = (chanel, id) => {
  const card = document.getElementsByClassName('posts')[0]
  .getElementsByTagName('ul')[0];
  const posts = chanel.getElementsByTagName('item');
  let prevPost = renderPost([...posts].slice(0,1)[0], id);
  card.prepend(prevPost);
  [...posts].slice(1,).forEach((post) => {
    //console.log(post);
    const newPost = renderPost(post, id);
    prevPost.after(newPost);
    prevPost = newPost;
  });
}

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
}

function urlProcessing(validUrl) {
  fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(validUrl)}`)
    .then((response) => {
      if (response.ok) return response.json();
      watchedState.validateStatus = 'loadError';
      throw new Error('Network response was not ok.');
    })
    .then((data) => parserFunc(data.contents))
    .catch((err) => {
      watchedState.validateStatus = 'loadError';
      throw new Error('load error');
    })
    .then((chanel) => {
      linkList = [validUrl, ...linkList];
      createChanell(chanel, validUrl);
      form.reset()
    }

    )
      //if (chanel.textContent) {


    //} else {
    //  watchedState.validateStatus = 'loadError';
    //}

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
        urlProcessing(link);
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
    //console.log(feed.id)
    fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(feed.getAttribute('url-chanel'))}`)
      .then((response) => {
        if (response.ok) return response.json();
        watchedState.validateStatus = 'loadError';
        throw new Error('Network response was not ok.');
      })
      .then((data) => parserFunc(data.contents))
      .catch((err) => {
        throw new Error('load error');
      })
      .then((chanel) => {
        const loadedPosts = [...chanel.getElementsByTagName('item')]
        .map((item) => item.getElementsByTagName('title')[0].textContent.trim());
        //console.log(postsList);
        //console.log(loadedPosts)
        //console.log(difference(postsTitles, loadedPosts));

        if (difference(postsTitles, loadedPosts).length !== 0) {
        [...postsList].forEach((post) => post.remove());
        fillPostsCard(chanel, feed.id)
      }

      }

    )

  })
}

form.addEventListener('submit', validateFunc);

const timeOutFunc = () => {
  setTimeout(() => {

  timeOutFunc();
  checkFeeds();
  //console.log(document.getElementsByClassName('feeds')[0].getElementsByTagName('li')[0].getAttribute('url-chanel'))

}, 5000);
}
timeOutFunc()
