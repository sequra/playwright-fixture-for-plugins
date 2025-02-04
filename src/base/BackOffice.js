import Fixture from "./Fixture.js";

/**
 * Interface for BackOffice fixtures
 */
export default class BackOffice extends Fixture {

    /**
     * Login
     * 
     * @param {Object} options Additional options
     * @returns {Promise<void>}
     */
    async login(options = {}) {
        throw new Error('Not implemented');
    }

    /**
     * Logout
     * 
     * @param {Object} options Additional options
     * @returns {Promise<void>}
     */
    async logout(options = {}) {
        throw new Error('Not implemented');
    }

    /**
     * Navigate to SeQura settings page
     * 
     * @param {Object} options
     * @param {string} options.page The page within settings to navigate to
     */
    async gotoSeQuraSettings(options = { page: '' }) {
        throw new Error('Not implemented');
    }

    /**
     * Navigate to Order listing page
     * 
     * @param {Object} options
     */
    async gotoOrderListing(options) {
        throw new Error('Not implemented');
    }
}