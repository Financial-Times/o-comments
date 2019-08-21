import Overlay from 'o-overlay';

const displayNameOverlay = () => {
	const overlayContent = `
		<form class="display-name-form">
			<input type="text" id="display-name"/>
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
		getDisplayName();
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

