import SettingsPage from './SettingsPage.js';

export default class OnboardingSettingsPage extends SettingsPage {

    /**
    * @param {import('@playwright/test').Page} page
    * @param {string} baseURL
    * @param {import('@playwright/test').Expect} expect
    * @param {import('@playwright/test').Request} request
    * @param {import('../base/BackOffice')} backOffice
    * @param {import('../utils/SeQuraHelper')} helper
    * @param {string} pageHash Page hash to navigate to
    */
    constructor(page, baseURL, expect, request, backOffice, helper) {
        super(page, baseURL, expect, request, backOffice, helper, 'onboarding-connect');
    }

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            ...super.initLocators(),
            sandboxOption: () => this.page.locator('label:has([value="sandbox"])'),
            username: () => this.page.locator('[name="username-input"]'),
            password: () => this.page.locator('[name="password-input"]'),
            completedStepConnect: () => this.page.locator('.sqp-step.sqs--completed[href="#onboarding-connect"]'),
            completedStepCountries: () => this.page.locator('.sqp-step.sqs--completed[href="#onboarding-countries"]'),
            merchantRefInput: countryCode => this.page.locator(`[name="country_${countryCode}"]`),
            yesOption: () => this.page.locator('.sq-radio-input:has([type="radio"][value="true"])'),
            assetsKey: () => this.page.locator('[name="assets-key-input"]'),
            headerNavbar: () => this.page.locator('.sqp-header-top > .sqp-menu-items'),
        };
    }

    /**
     * Fill the connect form
     * @param {Object} options 
     * @param {string} options.username The username to use
     * @param {string} options.password The password to use
     */
    async fillConnectForm(options) {
        const { username, password } = options;
        await this.locators.sandboxOption().click();
        await this.locators.username().fill(username);
        await this.locators.password().fill(password);
        await this.locators.primaryButton().click();
        await this.locators.completedStepConnect().waitFor({ timeout: 5000 });
    }

    /**
     * Fill countries configuration form
     * @param {Object} options
     * @param {Array<Object>} options.countries The countries to select
     * @param {string} options.countries[].code The country code
     * @param {string} options.countries[].name The country name
     * @param {Array<string>} options.countries[].merchantRef The merchant reference
     */
    async fillCountriesForm(options) {
        const { countries } = options;
        await this.locators.multiSelect().click();
        for (const { name } of countries) {
            await this.locators.dropdownListItem(name).click();
        }
        for (const { code, merchantRef } of countries) {
            await this.locators.merchantRefInput(code).fill(merchantRef);
        }
        await this.locators.primaryButton().click();
        await this.locators.completedStepCountries().waitFor({ timeout: 5000 });
    }

    /**
     * Fill widgets configuration form
     * @param {Object} options
     * @param {string} options.assetsKey The assets key
     */
    async fillWidgetsForm(options) {
        const { assetsKey } = options;
        await this.locators.yesOption().click();
        await this.locators.assetsKey().fill(assetsKey);
        await this.locators.primaryButton().click();
        await this.locators.primaryButton().click();
        await this.locators.headerNavbar().waitFor({ timeout: 5000 });
    }
}