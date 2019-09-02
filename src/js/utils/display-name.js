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

const saveDisplayName = (event) => {
	event.preventDefault();
	const submitForm = event.srcElement;
	const input = submitForm.querySelector('input');
	const displayName = input.value;

	if (isDisplayNameValid(displayName)) {
		storeDisplayName(displayName);

		document.dispatchEvent(new CustomEvent('oComments.displayNameValid', {
			detail: {
				displayName
			}
		}));
	} else {
		// TODO: Prompt user to enter another display name
	}
};

const isDisplayNameValid = (displayName) => {
	return displayName === 'foo' ? false : true;
};

export default displayNameOverlay;

