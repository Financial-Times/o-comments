import Overlay from 'o-overlay';

const displayNameOverlay = () => {
	const overlayContent = `
		<form class="display-name-form">
			<input type="text"/>
			<button type="submit">Submit</button>
		</form>`;

	const overlay = new Overlay('displayName', {
		heading: {
			title: 'Create a display name'
		},
		html: overlayContent
	});

	overlay.open();

	document.addEventListener('oOverlay.ready', () => {
		const submitForm = document.querySelector('.display-name-form');

		submitForm.addEventListener('submit', saveDisplayName);

		// TODO: Close the overlay when display name is successfully submitted
	});
};

const getDisplayName = () => {
	const submitForm = document.querySelector('.display-name-form');

	submitForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const displayName = document.getElementById('display-name').value;
		return displayName;
	});
};

export default displayNameOverlay;

