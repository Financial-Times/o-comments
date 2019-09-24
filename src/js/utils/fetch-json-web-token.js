export default (displayname, useStaging) => {

	const url = new URL('https://comments-api.ft.com/user/auth/');

	if (useStaging) {
		url.searchParams.append('staging', '1');
	}

	if (displayname) {
		url.searchParams.append('displayName', displayname);
	}

	return fetch(url.href, {
		credentials: 'include'
	}).then(response => {
		if (response.ok) {
			return response.json();
		} else {
			if (response.status === 409) {
				// User has a valid session but doesn't have a display name
				// They need to set a display name before they can be authenticated with Coral Talk
				return {
					validUser: true
				};
			}

			// User is not signed in, has an invalid session token
			// or there's an error from next-comments-api
			return {
				validUser: false
			};
		}
	});
};
