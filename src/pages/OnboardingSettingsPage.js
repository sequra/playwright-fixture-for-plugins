import ConnectionSettingsPage from './ConnectionSettingsPage.js';
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
        this.connectionSettingsPage = new ConnectionSettingsPage(page, baseURL, expect, request, backOffice, helper);
    }

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            ...super.initLocators(),
            completedStepConnect: () => this.page.locator('.sqp-step.sqs--completed[href="#onboarding-connect"]'),
            completedStepCountries: () => this.page.locator('.sqp-step.sqs--completed[href="#onboarding-countries"]'),
            completedStepDeploymentTargets: () => this.page.locator('.sqp-step.sqs--completed[href="#onboarding-deployments"]'),
            merchantRefInput: countryCode => this.page.locator(`[name="country_${countryCode}"]`),
            yesOption: () => this.page.locator('.sq-radio-input:has([type="radio"][value="true"])'),
            assetsKey: () => this.page.locator('[name="assets-key-input"]'),
            sendStatisticsCheckbox: () => this.page.locator('.sq-statistics input.sqp-checkbox-input'),
            headerNavbar: () => this.page.locator('.sqp-header-top > .sqp-menu-items'),
        };
    }

    /**
     * Fill the connect form
     * @param {Object} options 
     * @param {import('../utils/types.js').DeploymentTargetCredentials[]} options.credentials The credentials to use
     * @param {string} options.env The environment to use
     */
    async fillConnectForm(options) {
        await this.connectionSettingsPage.fillForm(options);
        // TODO: expect that the send statistical data checkbox is checked by default
        // await this.expect(this.locators.sendStatisticsCheckbox()).toBeChecked();
        await this.locators.yesOption().click();
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
        const { multiSelect, dropdownListItem, multiSelectSelectedListItem } = this.locators;
        for (const { name } of countries) {
            if ((await multiSelectSelectedListItem(name).count()) > 0) {
                continue; // Skip if already selected
            }
            // Ignore timeout error if the item is not selected
            await multiSelect().click();
            await dropdownListItem(name).click();
            await this.closeDropdownList(multiSelect());
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

    /**
     * Fill deployment targets form
     * @param {Object} options
     * @param {Array<Object>} options.deploymentTargets The deployment targets to select
     * @param {string} options.deploymentTargets[].name The country name
     */
    async fillDeploymentTargetsForm(options) {
        const { deploymentTargets } = options;
        const { multiSelect, dropdownListItem, multiSelectSelectedListItem } = this.locators;
        for (const { name } of deploymentTargets) {
            if ((await multiSelectSelectedListItem(name).count()) > 0) {
                continue; // Skip if already selected
            }
            // Ignore timeout error if the item is not selected
            await multiSelect().click();
            await dropdownListItem(name).click();
            await this.closeDropdownList(multiSelect());
        }
        await this.locators.primaryButton().click();
        await this.locators.completedStepDeploymentTargets().waitFor({ timeout: 5000 });
    }
}