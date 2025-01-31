import Page from "./Page.js";

/**
 * Checkout page
 */
export default class CheckoutPage extends Page {

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
        };
    }

    /**
     * Navigate to the page
     * 
     * @param {Object} options Additional options
     * @params {string} options.slug The product slug
     * @returns {Promise<void>}
     */
    async goto(options = {}) {
        await this.page.goto(this.checkoutUrl(options), { waitUntil: 'domcontentloaded' });
    }

    /**
     * Provide the checkout URL
     * @param {Object} options
     * @returns {string} The checkout URL
     */
    checkoutUrl(options) {
        throw new Error('Not implemented');
    }

    /**
     * Fill the checkout page's form
     * @param {Object} options Contains the data to fill the form
     * @returns {Promise<void>}
     */
    async fillForm(options) {
        throw new Error('Not implemented');
    }
}