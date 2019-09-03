/* eslint-env mocha */
import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';
import oComments from '../main.js';

describe("Comments", () => {
	it("is defined", () => {
		proclaim.equal(typeof oComments, 'function');
	});

	describe(".setConfig", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.setConfig, 'function');
		});

		describe("docs example", () => {
			it("doesn't error", () => {
				proclaim.doesNotThrow(() => oComments.setConfig({
					"loginUrl": "https://accounts-test.ft.com/login",
					"livefyre": {
        				"network": "ft-1.fyre.co",
        				"domain": "ft-1.auth.fyre.co"
    				}
				}));
			});
		});
	});

	describe(".init", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.init, 'function');
		});

		describe("docs example", () => {
			it("doesn't error", () => {
				proclaim.doesNotThrow(() => oComments.init());
			});
		});
	});

	describe(".enableLogging", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.enableLogging, 'function');
		});

		describe("docs example", () => {
			it("doesn't error", () => {
				proclaim.doesNotThrow(() => oComments.enableLogging());
			});
		});
	});

	describe(".disableLogging", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.disableLogging, 'function');
		});

		describe("docs example", () => {
			it("doesn't error", () => {
				proclaim.doesNotThrow(() => oComments.disableLogging());
			});
		});
	});

	describe(".setLoggingLevel", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.setLoggingLevel, 'function');
		});

		describe("docs example", () => {
			it("doesn't error", () => {
				proclaim.doesNotThrow(() => oComments.setLoggingLevel(3));
			});
		});
	});

	describe(".on", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.on, 'function');
		});

		describe("docs example", () => {
			it("doesn't error", () => {
				proclaim.doesNotThrow(() => oComments.on('auth.loginRequired', () => {}));
			});
		});
	});

	describe(".off", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.off, 'function');
		});

		describe("docs example", () => {
			it("doesn't error", () => {
				proclaim.doesNotThrow(() => oComments.off('auth.loginRequired', () => {}));
			});
		});
	});

	describe(".utils", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.utils, 'object');
		});

		describe(".emptyLivefyreActionQueue", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.utils.emptyLivefyreActionQueue());
				});
			});
		});

		describe(".isLivefyreActionQueuePresent", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.utils.isLivefyreActionQueuePresent());
				});
			});
		});

		describe(".isPermalinkPresent", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.utils.isPermalinkPresent());
				});
			});
		});

		describe(".cloneObject", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.utils.cloneObject());
				});
			});
		});
	});

	describe(".i18n", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.i18n, 'object');
		});

		describe("docs example", () => {
			it("doesn't error", () => {
				proclaim.doesNotThrow(() => oComments.i18n.lfStringOverride.featuredCommentsTitlePlural);
			});
		});
	});

	describe(".auth", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.auth, 'object');
		});

		describe(".login", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.auth.login());
				});
			});
		});

		describe(".logout", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.auth.logout());
				});
			});
		});

		describe(".loginRequired", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.auth.loginRequired());
				});
			});
		});


		describe(".loginRequiredPseudonymMissing", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.auth.loginRequiredPseudonymMissing());
				});
			});
		});

		describe(".loginRequiredDefaultBehavior", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.auth.loginRequiredDefaultBehavior());
				});
			});
		});

		describe(".setLoginRequiredDefaultBehavior", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.auth.setLoginRequiredDefaultBehavior());
				});
			});
		});
	});

	describe(".userDialogs", () => {
		it("is defined", () => {
			proclaim.equal(typeof oComments.userDialogs, 'object');
		});

		describe(".showSetPseudonymDialog", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.userDialogs.showSetPseudonymDialog());
				});
			});
		});

		describe(".showChangePseudonymDialog", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.userDialogs.showChangePseudonymDialog());
				});
			});
		});

		describe(".showEmailAlertDialog", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.userDialogs.showEmailAlertDialog());
				});
			});
		});

		describe(".showSettingsDialog", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.userDialogs.showSettingsDialog());
				});
			});
		});

		describe(".showInactivityMessage", () => {
			describe("docs example", () => {
				it("doesn't error", () => {
					proclaim.doesNotThrow(() => oComments.userDialogs.showInactivityMessage());
				});
			});
		});
	});
});
