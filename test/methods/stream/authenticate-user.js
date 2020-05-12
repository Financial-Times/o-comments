/* eslint-env mocha */
/* global proclaim sinon */
import * as fixtures from '../../helpers/fixtures';
import Stream from '../../../src/js/stream';
import * as auth from '../../../src/js/utils/auth';

export default function authenticateUser () {
	it("is a function", () => {
		proclaim.isFunction(new Stream().authenticateUser);
	});

	describe("comments api options", () => {
		beforeEach(() => {
			fixtures.streamMarkup();
		});

		afterEach(() => {
			fixtures.reset();
			sinon.restore();
		});

		it("displayName option is passed to fetchJsonWebToken", () => {
			const fetchJWTStub = sinon.stub(auth, 'fetchJsonWebToken').resolves({});

			const stream = new Stream();

			return stream.authenticateUser('Glynn')
				.then(() => {
					const options = fetchJWTStub.getCall(0).args[0];
					proclaim.equal(options.displayName, 'Glynn');
				});

		});

		it("displayName option is not used if undefined", () => {
			const fetchJWTStub = sinon.stub(auth, 'fetchJsonWebToken').resolves({});

			const stream = new Stream();

			return stream.authenticateUser(undefined)
				.then(() => {
					const options = fetchJWTStub.getCall(0).args[0];
					proclaim.isNotString(options.displayName);
				});

		});

		it("staging option is passed to fetchJsonWebToken", () => {
			const fetchJWTStub = sinon.stub(auth, 'fetchJsonWebToken').resolves({});

			const stream = new Stream(null, {
				useStagingEnvironment: true
			});

			return stream.authenticateUser()
				.then(() => {
					const options = fetchJWTStub.getCall(0).args[0];
					proclaim.equal(options.useStagingEnvironment, true);
				});

		});

	});

	describe("fetchJsonWebToken returns a token", () => {
		beforeEach(() => {
			fixtures.streamMarkup();
		});

		afterEach(() => {
			fixtures.reset();
			sinon.restore();
		});

		it("sets this.authenticationToken to the token", () => {
			sinon.stub(auth, 'fetchJsonWebToken').resolves({
				token: 'fake-jwt'
			});

			const stream = new Stream();

			return stream.authenticateUser()
				.then(() => {
					proclaim.equal(stream.authenticationToken, 'fake-jwt');
				});

		});

	});

	describe("fetchJsonWebToken returns a displayName", () => {
		beforeEach(() => {
			fixtures.streamMarkup();
		});

		afterEach(() => {
			fixtures.reset();
			sinon.restore();
		});

		it("sets this.displayName to the display name", () => {
			sinon.stub(auth, 'fetchJsonWebToken').resolves({
				displayName: 'fake-display-name'
			});

			const stream = new Stream();

			return stream.authenticateUser()
				.then(() => {
					proclaim.equal(stream.displayName, 'fake-display-name');
				});

		});

	});

	describe("fetchJsonWebToken returns userHasValidSession", () => {
		beforeEach(() => {
			fixtures.streamMarkup();
		});

		afterEach(() => {
			fixtures.reset();
			sinon.restore();
		});

		describe("userHasValidSession is true", () => {
			it("sets this.userHasValidSession to true", () => {
				sinon.stub(auth, 'fetchJsonWebToken').resolves({
					userHasValidSession: true
				});

				const stream = new Stream();
				return stream.authenticateUser()
					.then(() => {
						proclaim.isTrue(stream.userHasValidSession);
					});

			});
		});

		describe("userHasValidSession is false", () => {
			it("sets this.userHasValidSession to false", () => {
				sinon.stub(auth, 'fetchJsonWebToken').resolves({
					userHasValidSession: false
				});

				const stream = new Stream();
				return stream.authenticateUser()
					.then(() => {
						proclaim.isFalse(stream.userHasValidSession);
					});
			});
		});

	});
}
