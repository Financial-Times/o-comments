import Overlay from 'o-overlay';

const displayNameOverlay = () => {
	const overlayContent = `
		<form class="display-name-form">
			<span>Create a display name</span>
			<input type="text"/>
			<button type="submit">Save</button>
		</form>
	`;

	const overlay = new Overlay('displayName', { html: overlayContent });
	overlay.open();

	document.addEventListener('oOverlay.ready', () => {
		const submitForm = document.querySelector('.display-name-form');

		submitForm.addEventListener('submit', getDisplayName);

		// TODO: Close the overlay when display name is successfully submitted
	});
};

const getDisplayName = (event) => {
	event.preventDefault();
	const submitForm = event.srcElement;
	const input = submitForm.querySelector('input');
	const displayName = input.value;

	isDisplayNameValid(displayName)
		.then(isValid => {
			if (isValid) {
				storeDisplayName(displayName);
			} else {
				// TODO: Prompt user to enter a valid display name
			}
		});
};

const isDisplayNameValid = (displayName) => {
	const url = `https://comments-api.ft.com/user/displayname/${displayName}`;

	return fetch(url, { method: 'GET' })
		.then(response => {
			if (!response.ok) {
				return false;
			}
			return true;
		});
};

const storeDisplayName = (displayName) => {
	const url = `https://comments-api.ft.com/user/displayname/${displayName}`;

	return fetch(url, { method: 'POST' })
		.then(response => {
			if (!response.ok) {
				throw new Error(`Error: ${response.message}`);
			}
			return response.status;
		});
};

export default {
	displayNameOverlay
};
