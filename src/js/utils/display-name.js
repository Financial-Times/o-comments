import Overlay from 'o-overlay';
import displayNameForm from './display-name-form';

const renderOverlay = () => {
	const overlay = new Overlay('displayName', {
		html: displayNameForm,
		heading: {
			title: 'Choose a commenting display name'
		}
	});

	overlay.open();

	return overlay;
};

const getDisplayName = (event) => {
	const submitForm = event.srcElement;
	const input = submitForm.querySelector('input');
	const displayName = input.value;

	return displayName;
};

const displayNameDoesntMatchCoralTalkRules = (displayName) => {
	const containsCharactersNotInCoralTalkRules = /[^a-z0-9_.]+/i;

	return containsCharactersNotInCoralTalkRules.test(displayName) ?
		true :
		false;
};

const displayNameIsUnique = (displayName) => {
	const url = `https://comments-api.ft.com/user/displayname/${displayName}`;

	return fetch(url, { method: 'GET' })
		.then(response => response.json())
		.then(({available}) => {
			return available;
		});
};

const validateDisplayName = (overlay, resolve) => {
	const submitForm = document.getElementById('o-comments-displayname-form');

	submitForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const displayNameForm = document.getElementById('o-comments-displayname-form');
		const errorMessage = document.getElementById('o-comments-displayname-error');
		const displayName = getDisplayName(event);
		const trimmedDisplayName = displayName.trim();
		const containsInvalidCharacters = displayNameDoesntMatchCoralTalkRules(trimmedDisplayName);

		if (containsInvalidCharacters) {
			errorMessage.innerText = 'Only alphanumeric characters, underscores and periods are allowed';
			displayNameForm.classList.add('o-forms--error');
		} else {
			displayNameIsUnique(trimmedDisplayName)
				.then(isUnique => {
					if (isUnique) {
						overlay.close();
						resolve(trimmedDisplayName);
					} else {
						errorMessage.innerText = 'Unfortunately that display name is already taken';
						displayNameForm.classList.add('o-forms--error');
					}
				});
		}
	});
};

const renderPrompt = () => new Promise((resolve) => {
	const overlay = renderOverlay();

	document.addEventListener('oOverlay.ready', () => {
		validateDisplayName(overlay, resolve);
	});
});

export default renderPrompt;
