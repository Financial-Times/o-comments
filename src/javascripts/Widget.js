const deprecatedMessage = () => {
	throw new Error('o-comment v5 has been deprecated. Please upgrade to v6.x.');
};

module.exports = {
	init: deprecatedMessage,
	loadInitData: deprecatedMessage,
	render: deprecatedMessage,
	onError: deprecatedMessage,
	destroy: deprecatedMessage,
	on: deprecatedMessage,
	off: deprecatedMessage,
	setConfig: deprecatedMessage,
	utilities: deprecatedMessage,
	dataService: deprecatedMessage,
	utils: deprecatedMessage,
	i18n: deprecatedMessage,
	userDialogs: deprecatedMessage,
	auth: deprecatedMessage,
	enableLogging: deprecatedMessage,
	disableLogging: deprecatedMessage,
	setLoggingLevel: deprecatedMessage
};
