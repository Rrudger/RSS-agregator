import i18n from 'i18next';
import resources from './locales/en.js';

const i18nInstance = i18n.createInstance();
i18nInstance
    .init({
      lng: 'en',
      debug: true,
      resources: {
        en: {
          translation: resources.translation
        }
      },
    });

export default function changeForm (status, inputEl, warningEl) {
  warningEl.classList.remove('invisible');
  warningEl.classList.add('text-success');
  warningEl.classList.add('text-danger');
  warningEl.textContent = i18nInstance.t(`warning_${status}`);

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
