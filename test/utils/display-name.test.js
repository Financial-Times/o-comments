import proclaim from 'proclaim';
import fetchMock from 'fetch-mock';
import displayName from '../../src/js/utils/display-name';

const commentsApiUrl = 'https://comments-api.ft.com/user/displayname/test_display_name';

describe("display-name", () => {
	it("opens the overlay form", () => {
		displayName.displayNameOverlay();

		document.addEventListener('oOverlay.ready', () => {
			const formEl = document.querySelector('.display-name-form');
			proclaim.isNotNull(formEl);
		});
	});

	describe("when the form is submitted", () => {
		afterEach(() => {
			fetchMock.reset();
		});

		describe("when .isDisplayNameValid is called", () => {
			describe("when a display name is valid", () => {
				let getRequestMock;
				let postRequestMock;

				beforeEach(() => {
					getRequestMock = fetchMock.get(commentsApiUrl, 200);
					postRequestMock = fetchMock.post(commentsApiUrl, 200);
				});

				it("sends a get request to Comments API to validate display name", (done) => {
					displayName.displayNameOverlay();

					document.addEventListener('oOverlay.ready', () => {
						const inputEl = document.querySelector('input');
						inputEl.value = 'test_display_name';

						const buttonEl = document.querySelector('button');
						buttonEl.click();

						proclaim.isTrue(getRequestMock.called());
						done();
					});
				});

				it("sends a post request to Comments API to store the display name", (done) => {
					displayName.displayNameOverlay();

					document.addEventListener('oOverlay.ready', () => {
						const inputEl = document.querySelector('input');
						inputEl.value = 'test_display_name';

						const buttonEl = document.querySelector('button');
						buttonEl.click();

						proclaim.isTrue(postRequestMock.called());
						done();
					});
				});
			});

			describe("when a display name is invalid", () => {
				describe("when it contains invalid characters", () => {
					it("renders an error message to let the user know", (done) => {
						displayName.displayNameOverlay();

						document.addEventListener('oOverlay.ready', () => {
							const inputEl = document.querySelector('input');
							inputEl.value = 'test_display_name!';

							const buttonEl = document.querySelector('button');
							buttonEl.click();

							const errorEl = document.getElementById('character-error');
							proclaim.include(errorEl.innerHTML, 'Only alphanumeric characters, underscores and periods are allowed.');
							done();
						});
					});
				});

				describe("when it already exists", () => {
					beforeEach(() => {
						fetchMock.get(commentsApiUrl, 400);
					});

					it("renders an error message to let the user know", (done) => {
						displayName.displayNameOverlay();

						document.addEventListener('oOverlay.ready', () => {
							const inputEl = document.querySelector('input');
							inputEl.value = 'test_display_name';

							const buttonEl = document.querySelector('button');
							buttonEl.click();

							const errorEl = document.getElementById('duplicate-error');
							proclaim.include(errorEl.innerHTML, 'Display name is already in use');
							done();
						});
					});
				});
			});
		});
	});
});
