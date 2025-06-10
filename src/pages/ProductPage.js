import Page from "./Page.js";
/** @typedef {import('../utils/types.js').FrontEndWidgetOptions} FrontEndWidgetOptions */

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
            qtyInput: opt => this.qtyLocator(opt),
            addToCartButton: opt => this.addToCartLocator(opt),
             /**
             * Locator for the widget iframe based on the provided options or any widget if no options are provided
             * @param {FrontEndWidgetOptions|null} opt 
             * @returns {import('@playwright/test').Locator}
             */
            widget: (opt = null) => {
                if (!opt) {
                    return this.page.locator('.sequra-promotion-widget')
                }
                const {
                    locationSel,
                    widgetConfig,
                    product,
                    amount,
                    registrationAmount,
                    campaign = null
                } = opt;
                let containerSel = `${locationSel} ~ .sequra-promotion-widget.sequra-promotion-widget--${product}`;
                const styles = JSON.parse(widgetConfig);
                Object.keys(styles).forEach(key => {
                    containerSel += '' !== styles[key] ? `[data-${key}="${styles[key]}"]` : `[data-${key}]`;
                });
                containerSel += `[data-amount="${amount}"][data-loaded="1"]`;
                if (campaign) {
                    containerSel += `[data-campaign="${campaign}"]`;
                }
                if (registrationAmount !== null) {
                    containerSel += `[data-registration-amount="${registrationAmount}"]`;
                }
                return this.page.locator(containerSel);
            },
            /**
             * Locator for the widget iframe based on the provided options
             * @param {FrontEndWidgetOptions} opt 
             * @returns {import('@playwright/test').Locator}
             */
            widgetIframe: opt => this.locators.widget(opt).locator('iframe.Sequra__PromotionalWidget'),
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
        await this.goto(options);
        const { quantity } = options;
        const { qtyInput, addToCartButton } = this.locators;
        await qtyInput(options).fill(`${quantity || 1}`);
        await addToCartButton(options).click();
        await this.expectProductIsInCart(options);
    }

    /**
     * Expect no widgets to be visible
     */
    async expectWidgetsNotToBeVisible() {
        await this.expect(this.locators.widget()).toHaveCount(0);
    }

    /**
     * Expect the widget to be visible
     * 
     * @param {FrontEndWidgetOptions} options
     */
    async expectWidgetToBeVisible(options) {
        await this.locators.widgetIframe(options).waitFor({ timeout: 10000 });
    }

    /**
     * Expect that the widget is not visible
     * 
     * @param {FrontEndWidgetOptions} options
     */
    async expectWidgetNotToBeVisible(options) {
         await this.expect(this.locators.widget(options)).toHaveCount(0);
    }
}