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
            paymentMethodTitle: opt => this.paymentMethodTitleLocator(opt),
            paymentMethodInput: opt => this.paymentMethodInputLocator(opt),
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
     * Provide the locator to input the payment method
     * @param {Object} options
     * @param {string} options.product seQura product (i1, pp3, etc)
     * @param {boolean} options.checked Whether the payment method should be checked
     * @returns {import("@playwright/test").Locator}
     */
    paymentMethodInputLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator to input the payment method
     * @param {Object} options
     * @param {string} options.title Payment method title as it appears in the UI
     * @returns {import("@playwright/test").Locator}
     */
    paymentMethodTitleLocator(options) {
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

    /**
     * Expect payment method to be visible
     * @param {Object} options 
     * @param {string} options.title Payment method title as it appears in the UI
     * @param {string} options.product seQura product (i1, pp3, etc)
     * @param {boolean} options.checked Whether the payment method should be checked
     */
    async expectPaymentMethodToBeVisible(options) {
        const { title, product } = options;
        await this.expect(this.locators.paymentMethodInput(options), `"${product}" payment method input should be visible`).toBeVisible({ timeout: 10000 });
        await this.expect(this.locators.paymentMethodTitle(options), `"${title}" payment method should be visible`).toBeVisible({ timeout: 10000 });
    }
}