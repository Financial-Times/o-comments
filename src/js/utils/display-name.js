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
};

export default {
	displayNameOverlay
};
