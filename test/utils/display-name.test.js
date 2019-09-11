import proclaim from 'proclaim';
import {displayNameOverlay} from '../../src/js/utils/display-name';

describe("display-name", () => {
	describe(".displayNameOverlay", () => {
		it("opens the overlay", () => {
			displayNameOverlay();

			document.addEventListener('oOverlay.ready', () => {
				const overlayEl = document.querySelector('.display-name-form');
				proclaim.isNotNull(overlayEl);
			});
		});
	});
});
