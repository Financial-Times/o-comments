const getJsonWebToken = (displayName) => {
	const url = displayName ? `https://comments-api.ft.com/user/auth?displayName=${displayName}` : 'https://comments-api.ft.com/user/auth/';

	return fetch(url, { credentials: 'include' })
		.then(response => {
			// User is signed in but has no display name
			if (response.status === 205) {
				return { token: undefined, userIsSignedIn: true, displayName: false };
			}

			// User is signed in and has a display name
			if (response.ok) {
				return response.json();
			} else {
				// User is not signed in, session token is invalid or comments api error
				return { token: undefined, userIsSignedIn: false };
			}
		});
};


export {
	getJsonWebToken
};
