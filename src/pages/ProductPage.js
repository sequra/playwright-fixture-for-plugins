import PageWithWidgets from "./PageWithWidgets.js";
/** @typedef {import('../utils/types.js').FrontEndWidgetOptions} FrontEndWidgetOptions */

/**
 * Product page
 */
export default class ProductPage extends PageWithWidgets {

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            ...super.initLocators(),
            qtyInput: opt => this.qtyLocator(opt),
            addToCartButton: opt => this.addToCartLocator(opt)
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
        const url = this.productUrl(options);
        if (this.page.url() === url) {
            // Do not reload the page if we are already on the product page
            return;
        }

        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    /**
     * Provide the product URL
     * @param {Object} options
     * @param {string} options.slug The product slug
     * @returns {string} The product URL
     */
    productUrl(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator for the quantity input
     * 
     * @param {Object} options
     * @returns {import("@playwright/test").Locator}
     */
    qtyLocator(options = {}) {
        throw new Error('Not implemented');
    }
    /**
     * Provide the locator for adding to cart button
     * 
     * @param {Object} options
     * @returns {import("@playwright/test").Locator}
     */
    addToCartLocator(options = {}) {
        throw new Error('Not implemented');
    }

    /**
     * Wait for the product to be in the cart
     * @param {Object} options
     * @returns {Promise<void>}
     */
    async expectProductIsInCart(options = {}) {
        throw new Error('Not implemented');
    }

    /**
     * Add the product to the cart
     * 
     * @param {Object} options
     * @param {string} options.slug The product slug
     * @param {number} options.quantity The quantity to add to the cart
     */
    async addToCart(options) {
        await this.goto(options);
        const { quantity } = options;
        const { qtyInput, addToCartButton } = this.locators;
        await qtyInput(options).fill(`${quantity || 1}`);
        await addToCartButton(options).click();
        await this.expectProductIsInCart(options);
    }
}