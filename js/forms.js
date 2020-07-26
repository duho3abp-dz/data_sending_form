'use strict';

import {openModal, closeModal} from './modal';
import {postData} from '../services/services';

const forms = (formsSelectors, modalSelector, formSelector, modalTimerId) => {
    const forms = document.querySelectorAll(formsSelectors),
        modalContent = document.querySelector(modalSelector),
        formContent = modalContent.querySelector(formSelector);

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    const showThanksModal = message => {
        openModal('.modal', modalTimerId);
        formContent.classList.remove('show');
        formContent.classList.add('hide');

        const showContent = document.createElement('div');
        showContent.classList.add('modal__content');

        showContent.textContent = message;
        modalContent.append(showContent);

        setTimeout(() => {
            formContent.classList.remove('hide');
            formContent.classList.add('show');
            showContent.remove();
            closeModal('.modal');
        }, 2000);
    };

    const bindPostData = form => {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                    statusMessage.remove();
                });
        });
    };

    forms.forEach(form => {
        bindPostData(form);
    });
};
export default forms;