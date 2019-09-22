import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';
import fetchMock from 'fetch-mock';
import * as fixtures from './helpers/fixtures';
import Stream from '../src/js/stream';

const sandbox = sinon.createSandbox();

describe("Authentication", () => {
	beforeEach(() => {
		fixtures.streamMarkup();
	});

	afterEach(() => {
		fixtures.reset();
		sandbox.restore();
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
				const mockStreamEl = document.querySelector('[data-o-comments-article-id="id"]');
				const stream = new Stream(mockStreamEl);
				stream.init();

				document.addEventListener('oComments.ready', () => {
					stream.eventMapping('loginPrompt');
				});

				document.addEventListener('oComments.loginPrompt', () => {
					done();
				});
			}).timeout(5000);
		});
	});

	describe("User is logged in to the FT", () => {
		describe("User doesn't have a display name", () => {
			describe("User interacts with the comment component", () => {
				beforeEach(() => {
					fixtures.streamMarkup();
				});

				afterEach(() => {
					fixtures.reset();
					sandbox.restore();
				});
				before(() => {
					fetchMock.mock('https://comments-api.ft.com/user/auth/', 409);
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
					const mockStreamEl = document.querySelector('[data-o-comments-article-id="id"]');
					const stream = new Stream(mockStreamEl);
					stream.init();

					mockStreamEl.addEventListener('oComments.ready', () => {
						stream.eventMapping('loginPrompt');
						 document.addEventListener('oOverlay.ready', () => {
							const overlay = document.getElementById('o-comments-displayname-form');
							const input = overlay.querySelector('.o-comments-displayname-input');
							const submit = overlay.querySelector('button[type="submit"]');
							proclaim.isNotNull(input);
							proclaim.isNotNull(submit);
							done();
						 });
					});
				});

				it("displays a relevant error message if the display name entered contains invalid characters", (done) => {
					const mockStreamEl = document.querySelector('[data-o-comments-article-id="id"]');
					const stream = new Stream(mockStreamEl);
					stream.init();

					mockStreamEl.addEventListener('oComments.ready', () => {
						stream.eventMapping('loginPrompt');
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
				});

				it("displays a relevant error message if the display name entered is unavailable", (done) => {
					const mockStreamEl = document.querySelector('[data-o-comments-article-id="id"]');
					const stream = new Stream(mockStreamEl);
					stream.init();

					mockStreamEl.addEventListener('oComments.ready', () => {
						stream.eventMapping('loginPrompt');
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
							}, 500)
						 });
					});
				});
			});
		});
	});
});
