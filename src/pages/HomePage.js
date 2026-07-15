import PageWithBanner from "./PageWithBanner.js";

/**
 * Home page
 */
export default class HomePage extends PageWithBanner {

    /**
     * Navigate to the page
     *
     * @param {Object} options Additional options
     * @returns {Promise<void>}
     */
    async goto(options = {}) {
        const url = this.homeUrl(options);
        if (this.page.url() === url) {
            // Do not reload the page if we are already on the home page
            return;
        }

        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    /**
     * Provide the home page URL
     * @param {Object} options
     * @returns {string} The home page URL
     */
    homeUrl(options) {
        throw new Error('Not implemented');
    }
}
