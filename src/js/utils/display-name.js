import Overlay from 'o-overlay';

const displayNameOverlay = () => {
	const overlayContent = `
		<form>
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
};

export default displayNameOverlay;

