import {coralEventMap, findValidErrors} from './utils/events';
import displayNameOverlay from './utils/display-name';

class Stream {
	/**
	 * Class constructor.
	 *
	 * @param {HTMLElement} [streamEl] - The component element in the DOM
	 * @param {Object} [opts={}] - An options object for configuring the component
	 */
	constructor (streamEl, opts = {}) {
		this.streamEl = streamEl || document;
		this.options = opts;
		this.eventSeenTimes = {};
		this.useStagingEnvironment = !!opts.useStagingEnvironment;
	}

	init () {
		return Promise.all([this.renderComments(), this.getJsonWebToken()])
			.then(() => {
				if (!this.token && this.userIsSignedIn) {
					displayNameOverlay();

					document.addEventListener('oComments.displayNameValid', (event) => {
						this.getJsonWebToken(event.detail.displayName)
							.then(jsonWebToken => {
								this.token = jsonWebToken.token;
								this.login();
							});
					});
				} else {
					this.login(this.token);
				}
			});
	}

	login () {
		if (this.token && this.embed) {
			this.embed.login(this.token);
		} else {
			console.log("Unabled to login into comments as token or embed dont exist");
		}
	}

	getJsonWebToken (displayName) {
		const url = new URL('https://comments-api.ft.com/user/auth/');

		if (this.useStagingEnvironment) {
			url.searchParams.append('staging', '1');
		}

		if (this.options.sourceApp) {
			url.searchParams.append('sourceApp', this.options.sourceApp);
		}

		if (displayName) {
			url.searchParams.append('displayName', displayName);
		}

		return fetch(url, { credentials: 'include' }).then(response => {
			// user is signed in but has no display name
			if (response.status === 205) {
				return { token: undefined, userIsSignedIn: true };
			}

			// User is signed in and has a display name
			if (response.ok) {
				return response.json();
			} else {
				// User is not signed in, has an invalid session token
				// or there's an error from next-comments-api
				return { token: undefined, userIsSignedIn: false };
			}
		}).then(jsonWebToken => {

			if (jsonWebToken.token) {
				this.token = jsonWebToken.token;
			}

			if (jsonWebToken.userIsSignedIn) {
				this.userIsSignedIn = jsonWebToken.userIsSignedIn;
			}

			return jsonWebToken;

		}).catch(() => {
			return false;
		});
	}

	renderComments () {
		return new Promise((resolve) => {
			try {
				/*global Coral*/
				const scriptElement = document.createElement('script');
				scriptElement.src = this.useStagingEnvironment
					? 'https://ft.staging.coral.coralproject.net/assets/js/embed.js'
					: 'https://ft.coral.coralproject.net/assets/js/embed.js';

				const rootUrl = this.useStagingEnvironment
					? 'https://ft.staging.coral.coralproject.net'
					: 'https://ft.coral.coralproject.net';

				scriptElement.onload = () => {
					this.embed = Coral.createStreamEmbed(
						{
							id: this.streamEl.id,
							storyURL: this.options.storyUrl,
							storyID: this.options.articleId,
							rootURL: rootUrl,
							autoRender: true,
							events: (events) => {
								events.onAny((name, data) => {
									this.publishEvent({name, data});
								});
							}
						}
					);
					resolve();
				};
				this.streamEl.parentNode.appendChild(scriptElement);

				if (this.useStagingEnvironment) {
					const stagingWarning = document.createElement('div');
					stagingWarning.innerHTML = `
											<div class="o-comments__staging-message-container">
												<div class="o-comments__staging-message-content">
													<p class="o-comments__staging-message">You are on the staging environment for Comments</p>
												</div>
											</div>`;
					this.streamEl.parentNode.insertBefore(stagingWarning, this.streamEl);
				}

				document.dispatchEvent(new Event('oCommentsReady'));
			} catch (error) {
				resolve();
			}
		});
	}

	/**
	 * Emits events that have a valid o-comment event name.
	 *
	 * @param {String} name - The event name
	 * @param {Object} data - The event payload
	 */
	publishEvent ({name, data = {}}) {
		const {
			error: {
				errors
			} = {}
		} = data;

		const mappedEvent = coralEventMap.get(name);
		const validErrors = errors && Array.isArray(errors) ? findValidErrors(errors) : [];
		const eventsToPublish = mappedEvent ?
			[mappedEvent].concat(validErrors) :
			validErrors;

		eventsToPublish
			.forEach(eventMapping => {
				const now = +new Date;
				const delayInMilliseconds = 100;
				const eventHasntBeenSeenRecently = !this.eventSeenTimes[eventMapping.oComments] ||
					now > this.eventSeenTimes[eventMapping.oComments] + delayInMilliseconds;

				if (eventHasntBeenSeenRecently) {
					this.eventSeenTimes[eventMapping.oComments] = now;

					const oCommentsEvent = new CustomEvent(eventMapping.oComments, {
						bubbles: true
					});
					this.streamEl.dispatchEvent(oCommentsEvent);

					if (eventMapping.oTracking && !this.options.disableOTracking) {
						const oTrackingEvent = new CustomEvent('oTracking.event', {
							detail: {
								category: 'comment',
								action: eventMapping.oTracking
							},
							bubbles: true
						});
						document.body.dispatchEvent(oTrackingEvent);
					}
				}
			});
	}
}

export default Stream;
