import Page from "./Page.js";

/**
 * Storefront customer account page (shopper login).
 *
 * The library only ships admin login (BackOffice); logged-in shopper flows (e.g. Express Checkout)
 * need this. The login sequence is generic; the login URL, the email/password/submit locators and
 * the success signal are platform-specific. `expectLoggedIn()` is abstract on purpose so each
 * platform asserts a real logged-in state — never a URL pattern that also matches the login page.
 */
export default class AccountPage extends Page {

    /**
     * URL of the storefront login page. Platform-specific.
     * @returns {string}
     */
    loginUrl() {
        throw new Error('Not implemented');
    }

    /**
     * Assert the shopper is logged in (e.g. wait for the account dashboard). Platform-specific.
     * Must not accept the login page itself.
     * @returns {Promise<void>}
     */
    async expectLoggedIn() {
        throw new Error('Not implemented');
    }

    /**
     * Navigate to the login page.
     * @returns {Promise<void>}
     */
    async goto() {
        await this.page.goto(this.loginUrl());
    }

    /**
     * Log a registered customer in.
     * @param {Object} options
     * @param {string} options.email Customer email
     * @param {string} options.password Customer password
     * @returns {Promise<void>}
     */
    async login(options) {
        const { email, password } = options;
        await this.goto();
        await this.locators.email().fill(email);
        await this.locators.password().fill(password);
        await this.locators.submit().click();
        await this.expectLoggedIn();
    }
}
