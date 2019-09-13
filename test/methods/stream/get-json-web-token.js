import proclaim from 'proclaim';
import fetchMock from 'fetch-mock';
import * as fixtures from '../../helpers/fixtures';
import Stream from '../../../src/js/stream';

const commentsApiUrl = `https://comments-api.ft.com/user/auth/`;

module.exports = () => {
	beforeEach(() => {
		fixtures.streamMarkup();
	});

	afterEach(() => {
		fixtures.reset();
	});

	it("is a function", () => {
		proclaim.isFunction(new Stream().getJsonWebToken);
	});

	describe("when a display name is passed in", () => {
		before(() => {
			fetchMock.mock('https://comments-api.ft.com/user/auth?displayName=fake-display-name', {});
			fetchMock.mock(commentsApiUrl, {});
		});

		after(() => {
			fetchMock.reset();
		});

		it("fetches token using the display name", () => {
			return new Stream().getJsonWebToken('fake-display-name')
				.then(proclaim.isTrue(fetchMock.called('https://comments-api.ft.com/user/auth?displayName=fake-display-name')));
		});
	});

	describe("when comments api returns a valid response", () => {
		before(() => {
			fetchMock.mock(commentsApiUrl, { token: '12345' });
		});

		after(() => {
			fetchMock.reset();
		});

		it("returns a promise", () => {
			const returnValue = new Stream().getJsonWebToken();
			proclaim.isInstanceOf(returnValue, Promise);
		});

		it("returns a promise which contains a JSON Web Token as a string", () => {
			return new Stream().getJsonWebToken()
				.then(result => proclaim.isString(result.token));
		});
	});

	describe("when the comments api response is missing the token", () => {
		before(() => {
			fetchMock.mock(commentsApiUrl, {});
		});

		after(() => {
			fetchMock.reset();
		});

		it('resolves with an object', () => {
			return new Stream().getJsonWebToken()
				.then(result => proclaim.isObject(result));
		});

		it("resolves with undefined token", () => {
			return new Stream().getJsonWebToken()
				.then(result => proclaim.equal(result.token, undefined));
		});
	});

	describe("when the comments api response is missing the token", () => {
		before(() => {
			fetchMock.mock(commentsApiUrl, {token: undefined});
		});

		after(() => {
			fetchMock.reset();
		});

		it('resolves with an object', () => {
			return new Stream().getJsonWebToken()
				.then(proclaim.isObject);
		});

		it("resolves with undefined token", () => {
			return new Stream().getJsonWebToken()
				.then(result => proclaim.equal(result.token, undefined));
		});
	});

	describe("when the comments api responds with 205", () => {
		before(() => {
			fetchMock.mock(commentsApiUrl, 205);
		});

		after(() => {
			fetchMock.reset();
		});

		it('resolves with an object', () => {
			return new Stream().getJsonWebToken()
				.then(proclaim.isObject);
		});

		it("resolves with undefined token", () => {
			return new Stream().getJsonWebToken()
				.then(result => proclaim.equal(result.token, undefined));
		});

		it("resolves with userIsSignedIn true", () => {
			return new Stream().getJsonWebToken()
				.then((result) => proclaim.isTrue(result.userIsSignedIn));
		});
	});

	describe("when the comments api responds with 404", () => {
		before(() => {
			fetchMock.mock(commentsApiUrl, 404);
		});

		after(() => {
			fetchMock.reset();
		});

		it('resolves with an object', () => {
			return new Stream().getJsonWebToken()
				.then(proclaim.isObject);
		});

		it("resolves with undefined token", () => {
			return new Stream().getJsonWebToken()
				.then(result => proclaim.equal(result.token, undefined));
		});

		it("resolves with userIsSignedIn false", () => {
			return new Stream().getJsonWebToken()
				.then(result => proclaim.isFalse(result.userIsSignedIn));
		});
	});

	describe("when the comments api responds with a bad response other than 404", () => {
		before(() => {
			fetchMock.mock(commentsApiUrl, 500);
		});

		after(() => {
			fetchMock.reset();
		});

		it('resolves with an object', () => {
			return new Stream().getJsonWebToken()
				.then(result => proclaim.isObject(result));
		});

		it("resolves with undefined token", () => {
			return new Stream().getJsonWebToken()
				.then(result => proclaim.equal(result.token, undefined));
		});

		it("resolves with userIsSignedIn false", () => {
			return new Stream().getJsonWebToken()
				.then(result => proclaim.isFalse(result.userIsSignedIn));
		});
	});
};

