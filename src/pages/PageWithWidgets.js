import Page from "./Page.js";
/** @typedef {import('../utils/types.js').FrontEndWidgetOptions} FrontEndWidgetOptions */

/**
 * Base class for pages with widgets
 */
export default class PageWithWidgets extends Page {

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
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
            /**
             * Locator for the mini widget based on the provided options
             * @param {string} product Product name, e.g. 'pp3', 'sp1', etc.
             * @param {Object} options Additional options for the locator
             * @returns {import('@playwright/test').Locator} 
             */
            miniWidget: (product, options = null) => this.page.locator(`.sequra-educational-popup.sequra-promotion-miniwidget[data-product="${product}"]`, options),
        };
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
     * @param {number} options.timeout Timeout for the expectation. Default is 30000 ms.
     */
    async expectWidgetToBeVisible(options) {
        const { timeout = 30000 } = options;
        await this.locators.widgetIframe(options).waitFor({ state: 'visible', timeout });
    }

    /**
     * Expect that the widget is not visible
     * 
     * @param {FrontEndWidgetOptions} options
     */
    async expectWidgetNotToBeVisible(options) {
        await this.expect(this.locators.widget(options)).toHaveCount(0);
    }

    /**
     * Expect any visible mini widget
     * 
     * @param {string} product Product name, e.g. 'pp3', 'sp1', etc.
     * @param {Object} options Additional options for the locator
     */
    async expectAnyVisibleMiniWidget(product, options = null) {
        await this.locators.miniWidget(product, options).waitFor({ state: 'visible' });
    }

    /**
     * Expect the mini widgets not to be visible
     * 
     * @param {string} product Product name, e.g. 'pp3', 'sp1', etc.
     * @param {Object} options Additional options for the locator
     */
    async expectMiniWidgetsNotToBeVisible(product, options = null) {
        await this.expect(this.locators.miniWidget(product, options)).toHaveCount(0);
    }
}