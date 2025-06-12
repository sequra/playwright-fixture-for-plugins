import PageWithWidgets from "./PageWithWidgets.js";
/** @typedef {import('../utils/types.js').FrontEndWidgetOptions} FrontEndWidgetOptions */

/**
 * Category page
 */
export default class CategoryPage extends PageWithWidgets {

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            ...super.initLocators(),
        };
    }

    /**
     * Navigate to the page
     * 
     * @param {Object} options Additional options
     * @params {string} options.slug The category slug
     * @returns {Promise<void>}
     */
    async goto(options = {}) {
        const url = this.categoryUrl(options);
        if (this.page.url() === url) {
            // Do not reload the page if we are already on the category page
            return;
        }

        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    /**
     * Provide the category URL
     * @param {Object} options
     * @param {string} options.slug The category slug
     * @returns {string} The category URL
     */
    categoryUrl(options) {
        throw new Error('Not implemented');
    }
}