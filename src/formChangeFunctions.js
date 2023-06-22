import { uniqueId } from 'lodash';

function changeFormStatus(status, i18nInstance) {
  const inputEl = document.getElementById('url-input');
  const warningEl = document.getElementsByClassName('feedback')[0];

  warningEl.classList.remove('invisible');
  warningEl.classList.add('text-success');
  warningEl.classList.add('text-danger');
  warningEl.textContent = i18nInstance.t(`warning.${status}`);

  switch (status) {
    case 'neutral':
      warningEl.classList.add('invisible');
      inputEl.classList.remove('is-invalid');
      break;
    case 'valid':
      warningEl.classList.remove('text-danger');
      inputEl.classList.remove('is-invalid');
      break;
    default:
      inputEl.classList.add('is-invalid');
  }
}

function markViewedPost(id) {
  const link = document.getElementById(id).getElementsByTagName('a')[0];
  link.classList.remove('fw-bold');
  link.classList.add(...['fw-normal', 'link-secondary']);
}

function renderFeed(chanel, id, url) {
  const listItem = document.createElement('li');
  listItem.setAttribute('id', id);
  listItem.setAttribute('url-chanel', url);
  listItem.classList.add(...['list-group-item', 'border-0', 'border-end-0']);
  listItem.innerHTML = `<h3 class="h6 m-0">${chanel.getElementsByTagName('title')[0].textContent}</h3>
  <p class="m-0 small text-black-50">${chanel.getElementsByTagName('description')[0].textContent}</p>`;
  return listItem;
}

function renderPost(postLink, postTitle, feedId, i18nInstance) {
  const postId = uniqueId('post_');
  const modalId = `modal_${postId}`;
  const modalIdBtn = `#${modalId}`;
  const modalLabel = `${modalId}Label`;

  const listItem = document.createElement('li');

  listItem.classList.add(...['list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0']);
  listItem.setAttribute('feed-id', feedId);
  listItem.setAttribute('id', postId);
  listItem.innerHTML = `<a href=${postLink}
  class="fw-bold" target="_blank" rel="noopener noreferrer">
  ${postTitle}</a>
  <button type="button" class="btn btn-outline-primary btn-sm">${i18nInstance.t('buttons.view')}</button>`;

  return listItem;
}

function fillModal () {

}

function createCard(cardName) {
  const card = document.createElement('div');
  card.classList.add(...['card', 'border-0']);
  card.innerHTML = `<div class="card-body">
  <h2 class="card-title h4">${cardName}
  </h2></div><ul class="list-group border-0 rounded-0"></ul>`;
  return card;
}

export {
  changeFormStatus,
  markViewedPost,
  createCard,
  renderFeed,
  renderPost,
};
