import Page from "./Page";

/**
 * Product page
 */
export default class ProductPage extends Page {

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            qtyInput: this.qtyLocator,
            addToCartButton: this.addToCartLocator,
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
        await this.page.goto(this.productUrl(options), { waitUntil: 'domcontentloaded' });
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
        const { slug, quantity } = options;
        const { qtyInput, addToCartButton } = this.locators;
        await qtyInput(options).fill(`${quantity || 1}`);
        await addToCartButton(options).click();
        await this.expectProductIsInCart(options);
    }
}