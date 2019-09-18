import Overlay from 'o-overlay';

const renderOverlay= () => {
	const overlayContent = `
			<form id="o-comments-displayname-form" class="o-forms o-forms">
				<label for="o-comments-displayname-input" class="o-forms__label">Display name</label>
				<div class="o-comments--displayname-container">
					<input type="text" class="o-forms__text o-comments-displayname-input" id="o-comments-displayname-input">
					<button type="submit" class="o-comments-o-buttons--primary">Save</button>
				</div>
				<div id="o-comments-displayname-error" class="o-forms__errortext o-comments-displayname-error"></div>
			</form>
		</form>
	`;

	const overlay = new Overlay('displayName', {
		html: overlayContent,
		heading: {
			title: 'Choose a commenting display name',
			shaded: true
		}
	});

	overlay.open();

	return overlay;
}

const validateDisplayName = (event, done) => {
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
					done(trimmedDisplayName);
				} else {
					errorMessage.innerText = 'Unfortunately that display name is already taken';
					displayNameForm.classList.add('o-forms--error');
				}
			});
	}

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
}

const displayNameIsUnique = (displayName) => {
	const url = `https://comments-api.ft.com/user/displayname/${displayName}`;

	return fetch(url, { method: 'GET' })
		.then(response => response.json())
		.then(({available}) => {
			return available;
		});
}

export default () => new Promise((resolve, reject) => {
	const overlay = renderOverlay();

	document.addEventListener('oOverlay.ready', () => {
		const submitForm = document.getElementById('o-comments-displayname-form');

		submitForm.addEventListener('submit', (event) => {
			validateDisplayName(event, (displayName) => {
				overlay.close();
				resolve(displayName);
			});
		});
	});
});
