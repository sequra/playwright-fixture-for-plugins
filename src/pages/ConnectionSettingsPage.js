import SettingsPage from './SettingsPage.js';

export default class ConnectionSettingsPage extends SettingsPage {

    /**
    * @param {import('@playwright/test').Page} page
    * @param {string} baseURL
    * @param {import('@playwright/test').Expect} expect
    * @param {import('@playwright/test').Request} request
    * @param {import('../base/BackOffice.js')} backOffice
    * @param {import('../utils/SeQuraHelper.js')} helper
    * @param {string} pageHash Page hash to navigate to
    */
    constructor(page, baseURL, expect, request, backOffice, helper) {
        super(page, baseURL, expect, request, backOffice, helper, 'settings-connection');
    }

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            ...super.initLocators(),
            modalConfirmButton: () => this.page.locator('#sq-modal .sq-button.sqt--primary'),
            disconnect: () => this.page.getByRole('button', { name: 'Disconnect' }),
            envOption: (locate = 'input', env = 'sandbox') => {
                let selector = `[type="radio"][value="${env}"]`;
                return this.page.locator(locate === 'input' ? selector : `.sq-radio-input:has(${selector})`);
            },
            username: () => this.page.locator('[name="username-input"]'),
            password: () => this.page.locator('[name="password-input"]'),
        };
    }

    async confirmModal() {
        await this.locators.modalConfirmButton().waitFor({ state: 'visible' });
        await this.locators.modalConfirmButton().click();
    }

    async disconnect() {
        await this.locators.disconnect().click();
        await this.confirmModal();
        await this.page.waitForURL(/#onboarding-connect/);
    }

    /**
     * Fill the connect form
     * @param {Object} options 
     * @param {string} options.username The username to use
     * @param {string} options.password The password to use
     * @param {string} options.env The environment to use
     */
    async fillForm(options) {
        const { envOption, username, password } = this.locators;
        await envOption('label', options.env).click();
        await username().fill(options.username);
        await password().fill(options.password);
    }

    /**
     * Expect the form to have the values
     * @param {Object} options 
     * @param {string} options.username The username to use
     * @param {string} options.password The password to use
     * @param {string} options.env The environment to use
     */
    async expectFormToHaveValues(options) {
        const { username, password, env } = options;
        await this.expect(this.locators.username(), `Username field should be "${username}`).toHaveValue(username);
        await this.expect(this.locators.password(), `Password field should be "${password}`).toHaveValue(password);
        await this.expectToBeChecked(this.locators.envOption('input', env), `${'sandbox' === env ? 'Sandbox' : 'Live'} environment`, true);
    }
}