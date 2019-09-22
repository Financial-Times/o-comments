import {coralEventMap, findValidErrors} from './utils/events';
import displaynamePrompt from './utils/display-name';
import fetchJsonWebToken from './utils/fetch-json-web-token';

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
		return Promise.all([this.renderComments(), this.authenticateUser()])
			.then(() => {
				if (this.token) {
					return this.login(this.token);
				}

				const lastLogin = localStorage.getItem('oComments.login');
				const recentlyLoggedIn = lastLogin ?
						lastLogin  > (+new Date() - 120000) :
						false;

				if (this.displayNameRequired && recentlyLoggedIn) {
					this.authenticateUser();
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

	authenticateUser (displayname) {
		if (!displayname && (this.displayNameRequired && this.userValidated)) {
			return displaynamePrompt()
				.then(this.authenticateUser)
				.then(jsonWebToken => {
					this.token = jsonWebToken.token;
					this.login();
				});
		}

		return fetchJsonWebToken(displayname, this.useStagingEnvironment)
			.then(json => {
				if (json.token) {
					this.token = jsonWebToken.token;
				}

				if (json.displayName) {
					this.displayNameRequired = true;
				}

				if (json.validUser && !json.displayName) {
					this.displayNameRequired = true;
					this.userValidated = true;
				}

				return jsonWebToken;
			}).catch(() => {
				return false;
			});
	}

	eventMapping (name, data) {
		if (name === 'loginPrompt') {
			if (this.displayNameRequired && this.userValidated) {
				this.authenticateUser();
			} else {
				localStorage.setItem('oComments.login', +new Date());
				this.publishEvent({name, data});
			}
		} else {
			this.publishEvent({name, data});
		}
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
								events.onAny((name, data) => this.eventMapping(name, data));
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
