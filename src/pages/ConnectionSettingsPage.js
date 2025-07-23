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
            credentialsError: () => this.page.locator('.sqp-alert-title').filter({ hasText: 'Invalid username or password. Validate connection data.' }),
            deploymentTargetTab: (text = null) => {
                const selector = `.sqp-menu-items-deployments .sqp-menu-item`;
                return !text ? this.page.locator(selector) : this.page.locator(selector, { hasText: text });
            },
            manageDeploymentTargetsButton: () => this.page.locator('.sqm--deployment .sq-button'),
        };
    }

    async confirmModal() {
        await this.locators.modalConfirmButton().waitFor({ state: 'visible' });
        await this.locators.modalConfirmButton().click();
    }

    /**
     * Disconnect from a deployment target
     * @param {Object} options
     * @param {import('../utils/types.js').DeploymentTargetCredentials} options.credential The credentials to test with
     */
    async disconnect(options) {
        const { credential } = options;
        const { disconnect, deploymentTargetTab } = this.locators;

        await deploymentTargetTab(credential.name).click();
        await disconnect().click();
        await this.confirmModal();
        await this.expectLoadingShowAndHide();
    }

    /**
     * Fill the manage deployment targets form
     * @param {Object} options
     * @param {import('../utils/types.js').DeploymentTargetCredentials} options.credential The credentials to test with
     * @param {boolean} options.save Whether to save the changes or cancel them
     */
    async fillManageDeploymentTargetsForm(options) {
        const { credential, save } = options;
        const { username, password, manageDeploymentTargetsButton, deploymentTargetTab } = this.locators;
        await manageDeploymentTargetsButton().click();
        await deploymentTargetTab(credential.name).click();
        await username().fill(credential.username);
        await password().fill(credential.password);

        if (save) {
            await this.locators.primaryButton().click();
            await this.expectLoadingShowAndHide();
            // Check if the values were saved correctly
            await deploymentTargetTab(credential.name).click();
            await this.expect(username()).toHaveValue(credential.username, `Username should be "${credential.username}"`);
            await this.expect(password()).toHaveValue(credential.password, `Password should be "${credential.password}"`);
        } else {
            await this.locators.secondaryButton().click();
            await this.expect(deploymentTargetTab(credential.name)).toHaveCount(0, `Deployment target ${credential.name} should not be visible after canceling`);
        }
    }

    /**
     * Disconnect the remaining deployment targets
     */
    async disconnectAll() {
        const { disconnect } = this.locators;
        while ((await disconnect().count()) > 0) {
            await disconnect().click();
            await this.confirmModal();
            await this.expectLoadingShowAndHide();
        }
        await this.page.waitForURL(/#onboarding-deployments/);
    }

    /**
     * Fill the connect form
     * @param {Object} options
     * @param {import('../utils/types.js').DeploymentTargetCredentials[]} options.credentials The credentials to use
     * @param {string} options.env The environment to use
     */
    async fillForm(options) {
        const { envOption, deploymentTargetTab, username, password } = this.locators;
        await envOption('label', options.env).click();

        for (const credential of options.credentials) {
            await deploymentTargetTab(credential.name).click();
            await username().fill(credential.username);
            await password().fill(credential.password);
        }
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

    /**
     * Expect the credentials error to be visible
     */
    async expectCredentialsErrorToBeVisible() {
        await this.locators.credentialsError().waitFor({ state: 'visible' });
    }
}