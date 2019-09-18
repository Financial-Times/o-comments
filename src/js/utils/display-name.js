import Overlay from 'o-overlay';

const displayNameOverlay = () => {
	const overlayContent = `
		<form class="display-name-form">
			<div class="o-forms">
				<label class="o-forms__label">Display name</label>
				<input type="text" class="o-forms__text" />
				<div id="duplicate-error">
					<div class="o-forms__errortext">Display name is already in use.</div>
				</div>
				<div id="character-error">
					<div class="o-forms__errortext">Only alphanumeric characters, underscores and periods are allowed.</div>
				</div>
			</div>
			<button class="o-buttons o-buttons--primary">Save</button>
			<button class="o-buttons o-buttons--primary o-overlay__close">Close</button>
		</form>
	`;

	const overlay = new Overlay('displayName', {
		html: overlayContent,
		customclose: true
	});

	overlay.open();

	document.addEventListener('oOverlay.ready', () => {
		const submitForm = document.querySelector('.display-name-form');

		submitForm.addEventListener('submit', getDisplayName);
	});

	document.addEventListener('oComments.displayNameValid', () => {
		overlay.close();
	});
};

const getDisplayName = (event) => {
	event.preventDefault();
	const submitForm = event.srcElement;
	const input = submitForm.querySelector('input');
	const displayName = input.value;

	isDisplayNameValid(displayName)
		.then(response => {
			if (response.isValid) {
				const event = new CustomEvent('oComments.displayNameValid', {
					detail: {
						displayName
					}
				});
				document.dispatchEvent(event);

				storeDisplayName(displayName);
			} else {
				const duplicateErrorEl = document.getElementById('duplicate-error');
				const characterErrorEl = document.getElementById('character-error');

				if (response.displayNameExists) {
					duplicateErrorEl.className = 'o-forms--error';
					characterErrorEl.className = '';
				} else {
					characterErrorEl.className = 'o-forms--error';
					duplicateErrorEl.className = '';
				}
			}
		});
};

const isDisplayNameValid = (displayName) => {
	const regex = /[^a-zA-Z0-9_.]+/;

	if (regex.test(displayName)) {
		return Promise.resolve({ isValid: false });
	}

	const trimmedDisplayName = displayName.trim();
	const url = `https://comments-api.ft.com/user/displayname/${trimmedDisplayName}`;

	return fetch(url, { method: 'GET' })
		.then(response => {
			if (!response.ok) {
				return { isValid: false, displayNameExists: true };
			}
			return { isValid: true };
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
