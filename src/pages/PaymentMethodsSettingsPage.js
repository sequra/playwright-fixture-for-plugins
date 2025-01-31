import SettingsPage from './SettingsPage.js';

/**
 * Payment methods settings page
 */
export default class PaymentMethodsSettingsPage extends SettingsPage {

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
        super(page, baseURL, expect, request, backOffice, helper, 'payment-methods');
    }

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            ...super.initLocators(),
            paymentMethodTitle: text => this.page.locator('.sqp-payment-method-title', { hasText: text }),
        };
    }

    /**
     * Verify that the available payment methods are visible
     * 
     * @param {Array<Object>} countries Countries to check. The first one is the default that should be selected
     * @param {string} countries[].name The country name
     * @param {Array<string>} countries[].paymentMethods The payment methods to check
     * @returns {Promise<void>}
     */
    async expectAvailablePaymentMethodsAreVisible(countries) {
        const [defaultCountry, ...otherCountries] = countries;
        await this.expect(this.locators.selectedOption(defaultCountry.name), `The default country "${defaultCountry.name}" is shown as selected`).toBeVisible();

        for (const { name, paymentMethods } of otherCountries) {
            await this.locators.dropdownButton().click();
            await this.locators.dropdownListItem(name).click();
            await this.expect(this.locators.dropdownSelectedListItem(name), `The country "${name}" is shown as selected`).toBeVisible();
            await this.expectLoadingShowAndHide();

            for (const paymentMethod of paymentMethods) {
                await this.expect(this.locators.paymentMethodTitle(paymentMethod), `The payment method "${paymentMethod}" is visible`).toBeVisible();
            }

        }
    }
}