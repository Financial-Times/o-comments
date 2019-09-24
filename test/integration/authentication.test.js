import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';
import fetchMock from 'fetch-mock';
import * as fixtures from '../helpers/fixtures';
import Stream from '../../src/js/stream';

const sandbox = sinon.createSandbox();

const interactWithComponent = (commentsInstance) => {
	/*
	 * As Coral Talk lives in an iframe we are unable to actually interact with it
	 * Instead we call the same method that would get called by Coral Talk events
	 * This part of the test relies on the agreement of Coral Talk events
	 */
	commentsInstance.eventMapping('loginPrompt');
};

const checkPromptExists = (done) => {
	const overlay = document.getElementById('o-comments-displayname-form');
	const input = overlay.querySelector('.o-comments-displayname-input');
	const submit = overlay.querySelector('button[type="submit"]');
	proclaim.isNotNull(input);
	proclaim.isNotNull(submit);
	done();
};

describe("Authentication", () => {
	afterEach(() => {
		fixtures.reset();
		sandbox.restore();
		localStorage.clear();
	});

	describe("User isn't logged in to the FT", () => {
		describe("User interacts with the comment component", () => {
			before(() => {
				fetchMock.mock('https://comments-api.ft.com/user/auth/', 404);
			});

			after(() => {
				fetchMock.reset();
			});

			it("dispatches a login event so the consuming app can direct the user to login", (done) => {
				fixtures.streamMarkup();

				const mockStreamEl = document.querySelector('[data-o-comments-article-id="id"]');
				const stream = new Stream(mockStreamEl);
				stream.init();

				mockStreamEl.addEventListener('oComments.ready', () => {
					interactWithComponent(stream);
				});

				mockStreamEl.addEventListener('oComments.loginPrompt', () => {
					proclaim.isTrue(true);
					done();
				});
			}).timeout(5000);

			it("sets a oComments.login localStorage value", (done) => {
				fixtures.streamMarkup();
				const mockStreamEl = document.querySelector('[data-o-comments-article-id="id"]');
				const stream = new Stream(mockStreamEl);
				stream.init();

				mockStreamEl.addEventListener('oComments.ready', () => {
					interactWithComponent(stream);
				});

				mockStreamEl.addEventListener('oComments.loginPrompt', () => {
					const loginTime = localStorage.getItem('oComments.login');
					proclaim.isNotNull(loginTime);
					done();
				});
			}).timeout(5000);
		});
	});

	describe("User recently logged in to the FT", () => {
		describe("User doesn't have a display name", () => {
			before(() => {
				fetchMock.mock('https://comments-api.ft.com/user/auth/', 409);
			});

			after(() => {
				fetchMock.reset();
			});

			it("prompts the user to add a display name on page load", (done) => {
				fixtures.streamMarkup();
				const now = +new Date();
				const mockStreamEl = document.querySelector('[data-o-comments-article-id="id"]');
				const stream = new Stream(mockStreamEl);

				localStorage.setItem('oComments.login', now);
				stream.init();

				 document.addEventListener('oOverlay.ready', () => {
					checkPromptExists(done);
				 });
			});
		});
	});

	describe("User is logged in to the FT", () => {
		describe("User doesn't have a display name", () => {
			describe("User interacts with the comment component", () => {
				before(() => {
					fetchMock.mock('https://comments-api.ft.com/user/auth/', 409, {
						overwriteRoutes: true
					});
					fetchMock.mock('https://comments-api.ft.com/user/displayname/foo', {
						body: {
							available: false
						}
					});
				});

				after(() => {
					fetchMock.reset();
				});

				it("prompts the user to add a display name", (done) => {
					fixtures.streamMarkup();
					const mockStreamEl = document.querySelector('[data-o-comments-article-id="id"]');
					const stream = new Stream(mockStreamEl);
					stream.init();

					mockStreamEl.addEventListener('oComments.ready', () => {
						interactWithComponent(stream);
					});

					document.addEventListener('oOverlay.ready', () => {
						checkPromptExists(done);
					 });
				});
			});

			describe("User enters a display name", () => {
				before(() => {
					fetchMock.mock('https://comments-api.ft.com/user/auth/', 409, {
						overwriteRoutes: true
					});
					fetchMock.mock('https://comments-api.ft.com/user/displayname/foo', {
						body: {
							available: false
						}
					});
				});

				it("displays a relevant error message if the display name entered contains invalid characters", (done) => {
					fixtures.streamMarkup();
					const mockStreamEl = document.querySelector('[data-o-comments-article-id="id"]');
					const stream = new Stream(mockStreamEl);
					stream.init();

					mockStreamEl.addEventListener('oComments.ready', () => {
						interactWithComponent(stream);
					});
					document.addEventListener('oOverlay.ready', () => {
						const form = document.getElementById('o-comments-displayname-form');
						const input = form.querySelector('.o-comments-displayname-input');
						const submit = form.querySelector('button[type="submit"]');
						const error = form.querySelector('#o-comments-displayname-error');

						input.value = '!!!';
						submit.click();

						proclaim.equal(error.innerText, 'Only alphanumeric characters, underscores and periods are allowed');
						done();
					 });
				});

				it("displays a relevant error message if the display name entered is unavailable", (done) => {
					fixtures.streamMarkup();
					const mockStreamEl = document.querySelector('[data-o-comments-article-id="id"]');
					const stream = new Stream(mockStreamEl);
					stream.init();

					mockStreamEl.addEventListener('oComments.ready', () => {
						interactWithComponent(stream);
					});

					document.addEventListener('oOverlay.ready', () => {
						const form = document.getElementById('o-comments-displayname-form');
						const input = form.querySelector('.o-comments-displayname-input');
						const submit = form.querySelector('button[type="submit"]');
						const error = form.querySelector('#o-comments-displayname-error');

						input.value = 'foo';
						submit.click();

						window.setTimeout(() => {
							proclaim.equal(error.innerText, 'Unfortunately that display name is already taken');
							done();
						}, 500);
					});
				});
			});
		});
	});
});
