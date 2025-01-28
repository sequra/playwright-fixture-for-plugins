/**
 * Base class for all the fixtures
 */
export default class Fixture {

    /**
     * @param {import('@playwright/test').Page} page
     * @param {string} baseURL
     * @param {import('@playwright/test').Expect} expect
     */
    constructor(page, baseURL, expect) {
        this.page = page;
        this.baseURL = baseURL;
        this.expect = expect;
        this.locators = this.initLocators();
    }

    /**
     * Init the locators with the locators available
     * 
     * @returns {Object}
     */
    initLocators() {
        return {};
    }
}