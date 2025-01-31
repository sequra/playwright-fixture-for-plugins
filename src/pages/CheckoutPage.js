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
     * @param {string} options.email Email
     * @param {string} options.firstName First name
     * @param {string} options.lastName Last name
     * @param {string} options.address1 Address first line
     * @param {string} options.country Typically a 2-letter ISO country code
     * @param {string} options.state Name of the state
     * @param {string} options.city Name of the city
     * @param {string} options.postcode Postcode
     * @param {string} options.phone Phone number
     * @param {string} options.shippingMethod Shipping method
     * @returns {Promise<void>}
     */
    async fillForm(options) {
        throw new Error('Not implemented');
    }
}