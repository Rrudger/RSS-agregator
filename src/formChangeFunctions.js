

function changeFormStatus (status, i18nInstance) {
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
      inputEl.classList.remove('is-valid');
      inputEl.value = '';
      break;
    case 'valid':
      warningEl.classList.remove('text-danger');
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
      inputEl.value = '';
      break;
    default:
      inputEl.classList.remove('is-valid');
      inputEl.classList.add('is-invalid');
  }
}


function renderFeed(chanel) {
  const listItem = document.createElement('li');
  const classes = ['list-group-item', 'border-0', 'border-end-0'];
  listItem.classList.add(...classes);
  listItem.innerHTML = `<h3 class="h6 m-0">${chanel.getElementsByTagName('title')[0].textContent}</h3>
  <p class="m-0 small text-black-50">${chanel.getElementsByTagName('description')[0].textContent}</p>`;
  return listItem;
}

function renderPost (post) {
  const listItem = document.createElement('li');
  listItem.classList.add(...['list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0']);
  listItem.innerHTML = `<a href=${post.getElementsByTagName('link')[0].textContent} class="fw-bold" data-id="23" target="_blank" rel="noopener noreferrer">${post.getElementsByTagName('title')[0].textContent}</a><button type="button" class="btn btn-outline-primary btn-sm" data-id="23" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
  return listItem;
}

function createCard (cardName) {
  const card = document.createElement('div');
  card.classList.add(...['card', 'border-0']);
  card.innerHTML = `<div class="card-body"><h2 class="card-title h4">${cardName}</h2></div><ul class="list-group border-0 rounded-0"></ul>`;
  return card;
}

export {changeFormStatus, createCard, renderFeed, renderPost};
