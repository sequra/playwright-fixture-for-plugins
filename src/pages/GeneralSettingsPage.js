import SettingsPage from './SettingsPage.js';

export default class GeneralSettingsPage extends SettingsPage {

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
        super(page, baseURL, expect, request, backOffice, helper, 'settings-general');
    }

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            ...super.initLocators(),
            allowedIPAddressesRemoveBtn: () => this.page.locator('.sq-multi-item-selector:has([name="allowedIPAddresses-selector"]) .sqp-selected-item > .sqp-remove-button'),
            allowedIPAddressesInput: () => this.page.locator('[name="allowedIPAddresses-selector"] + .sq-multi-input'),
            allowedIPAddressesHiddenInput: () => this.page.locator('[name="allowedIPAddresses-selector"]'),
            countriesMultiSelect: () => this.page.locator('.sq-multi-item-selector:has([name="countries-selector"])'),
            countriesSelect: () => this.page.locator('[name="countries-selector"]'),
            excludedProducts: () => this.page.locator('.sq-field-wrapper').filter({ hasText: 'Excluded products' }).first().locator('.sq-label-wrapper + div').first(),
            excludedProductsMultiInput: () => this.locators.excludedProducts().locator('.sq-multi-input'),
            excludedProductsHiddenInput: () => this.locators.excludedProducts().locator('.sqp-hidden-input'),
            excludedCategories: () => this.page.locator('.sq-field-wrapper').filter({ hasText: 'Excluded categories' }).first().locator('.sq-label-wrapper + div').first(),
            excludedCategoriesHiddenInput: () => this.locators.excludedCategories().locator('.sqp-hidden-input').first(),
            enabledForServicesToggle: (locate = 'input') => this.locators.toggle(this.page.locator('.sq-field-enabled-for-services'), locate),
            allowFirstServicePaymentDelayToggle: (locate = 'input') => this.locators.toggle(this.page.locator('.sq-field-allow-first-service-payment-delay'), locate),
            allowRegistrationItemsToggle: (locate = 'input') => this.locators.toggle(this.page.locator('.sq-field-allow-service-registration-items'), locate),
            defaultServicesEndDateInput: () => this.page.locator('.sq-text-input.sq-default-services-end-date'),
            countryInput: code => this.page.locator(`[name="country_${code}"]`),
            countryInputError: () => this.page.locator('.sq-country-field-wrapper .sqp-input-error').filter({ hasText: 'This field is invalid.' })
        };
    }

    async expectAllowedIPAddressesToBeEmpty() {
        await this.expect(this.locators.allowedIPAddressesHiddenInput(), '"Allowed IP addresses" should be empty').toHaveValue('');
    }

    async expectAllowedIPAddressesToHaveValue(value) {
        await this.expect(this.locators.allowedIPAddressesHiddenInput(), '"Allowed IP addresses" should have value: ' + value).toHaveValue(value);
    }

    async expectExcludedProductsToBeEmpty() {
        await this.expect(this.locators.excludedProductsHiddenInput(), '"Excluded products" should be empty').toHaveValue('');
    }

    async expectExcludedCategoriesToBeEmpty() {
        await this.expect(this.locators.excludedCategoriesHiddenInput(), '"Excluded Categories" should be empty').toHaveValue('');
    }

    /**
     * @param {string[]} addresses
     */
    async fillAllowedIPAddresses(addresses) {
        const inputLocator = this.locators.allowedIPAddressesInput();

        // Clear previous values
        while ((await this.locators.allowedIPAddressesRemoveBtn().count()) > 0) {
            await this.locators.allowedIPAddressesRemoveBtn().first().click();
        }

        await this.expectAllowedIPAddressesToBeEmpty();

        let value = '';
        for (const address of addresses) {
            await inputLocator.focus();
            await inputLocator.fill(address);
            await this.page.keyboard.press('Enter');
            value += '' === value ? address : ',' + address;
            await this.expect(this.locators.allowedIPAddressesHiddenInput(), '"Allowed IP addresses" should have value "' + value + '"').toHaveValue(value);
            await this.expect(inputLocator, '"Allowed IP addresses" input field should be empty').toHaveValue('');
        }
    }

    /**
     * @param {string[]} values
     */
    async fillExcludedProducts(values) {
        const { selectedItemRemoveButton, excludedProducts, excludedProductsMultiInput, excludedProductsHiddenInput } = this.locators;
        // Clear previous values
        while ((await selectedItemRemoveButton(excludedProducts()).count()) > 0) {
            await selectedItemRemoveButton(excludedProducts()).first().click();
        }

        await this.expectExcludedProductsToBeEmpty();

        if (values) {
            const inputLocator = excludedProductsMultiInput();
            let value = '';
            for (const v of values) {
                await inputLocator.focus();
                await inputLocator.fill(v);
                await this.page.keyboard.press('Enter');
                value += '' === value ? v : ',' + v;
                await this.expect(excludedProductsHiddenInput(), `"Excluded products" should have value "${value}"`).toHaveValue(value);
                await this.expect(inputLocator, '"Excluded products" input field should be empty').toHaveValue('');
            }
        }
    }

    /**
     * @param {string[]} categories
     */
    async selectExcludedCategories(categories) {
        // Clear previous values
        const { selectedItemRemoveButton, excludedCategories, selectedItem } = this.locators;
        while ((await selectedItemRemoveButton(excludedCategories()).count()) > 0) {
            await selectedItemRemoveButton(excludedCategories()).first().click();
        }

        await this.expectExcludedCategoriesToBeEmpty();

        if (!categories) {
            return;
        }
        await excludedCategories().click();
        for (const category of categories) {
            const listItemLocator = excludedCategories().getByText(category);
            await listItemLocator.waitFor({ state: 'visible' });
            await listItemLocator.click();
            await selectedItem(excludedCategories(), category).waitFor({ state: 'visible' });
        }
        await this.closeDropdownList(excludedCategories());
    }

    /**
     * @param {string} value 
     */
    async fillDefaultServicesEndDate(value) {
        const { defaultServicesEndDateInput } = this.locators;
        await defaultServicesEndDateInput().fill(value);
        await defaultServicesEndDateInput().blur();
    }

    /**
     * @typedef {Object} CountryRef
     * @property {string} country
     * @property {string} ref
     */

    /**
     * Expect values for countries configuration form are set
     * @param {Object} options
     * @param {Array<Object>} options.countries The countries to select
     * @param {string} options.countries[].code The country code
     * @param {string} options.countries[].name The country name
     * @param {Array<string>} options.countries[].merchantRef The merchant reference
     */
    async expectAvailableCountries(options) {
        const { countries } = options;
        const { selectedItem, countriesSelect } = this.locators;
        const codes = [];
        for (const { code, name } of countries) {
            codes.push(code);
            await this.expectToBeVisible(selectedItem(this.page, name), `Country "${name}"`, true);
        }
        codes.sort();
        // read the value of the hidden input
        const actualCodes = (await countriesSelect().inputValue()).split(',').filter(v => v.trim() !== '').sort();
        // compare the values
        this.expect(codes, `Countries selector input value should be "${codes.join(',')}"`).toEqual(actualCodes);
    }

    /**
      * Fill countries configuration form
      * @param {Object} options
      * @param {Array<Object>} options.countries The countries to select
      * @param {string} options.countries[].name The country name
      */
    async fillAvailableCountries(options) {
        const { countries } = options;
        const { countriesMultiSelect, selectedItemRemoveButton, dropdownListVisible, dropdownListItem } = this.locators;
        // Clear previous values
        while ((await selectedItemRemoveButton(countriesMultiSelect()).count()) > 0) {
            await selectedItemRemoveButton(countriesMultiSelect()).first().click();
        }
        await this.expectAvailableCountries({ countries: [] });
        if (!countries) {
            return;
        }
        await countriesMultiSelect().click();
        await dropdownListVisible().waitFor({ timeout: 1000 });
        for (const { name } of countries) {
            await dropdownListItem(name).click();
        }
        await this.closeDropdownList(countriesMultiSelect());
    }

    /**
     * Expect the country input error to be visible
     */
    async expectCountryInputErrorToBeVisible() {
        await this.expectToBeVisible(this.locators.countryInputError(), 'Country input error', true);
    }

    /**
     * Expect services configuration to be set
     * 
     * @param {Object} options
     * @param {Array<string>} options.enabledForServices Countries codes where services that should be enabled. Default is [].
     * @param {Array<string>} options.allowRegistrationItems Countries codes where registration items should be allowed. Default is [].
     * @param {Array<string>} options.allowFirstServicePaymentDelay Countries codes where first service payment delay should be allowed. Default is [].
     * @param {string} options.defaultServicesEndDate Default services end date value. Default is 'P1Y'.
     * @returns {Promise<void>}
     */
    async expectServicesConfiguration(options = {}) {
        const { enabledForServices = [], allowRegistrationItems = [], allowFirstServicePaymentDelay = [], defaultServicesEndDate = 'P1Y' } = options;
        const { enabledForServicesToggle, allowFirstServicePaymentDelayToggle, allowRegistrationItemsToggle, defaultServicesEndDateInput } = this.locators;
        const enabled = enabledForServices.length > 0;
        await this.expectToBeChecked(enabledForServicesToggle(), '"Enable for service" toggle', enabled);
        await this.expectToBeVisible(allowFirstServicePaymentDelayToggle('label'), '"Allow First Service Payment Delay" toggle', enabled);
        await this.expectToBeVisible(allowRegistrationItemsToggle('label'), '"Allow registration items" toggle', enabled);
        await this.expectToBeVisible(defaultServicesEndDateInput(), '"Default services end date" input', enabled);
        if ( enabled ) {
            await this.expectToBeChecked(allowFirstServicePaymentDelayToggle(), '"Allow First Service Payment Delay" toggle', enabled && allowFirstServicePaymentDelay.length > 0);
            await this.expectToBeChecked(allowRegistrationItemsToggle(), '"Allow registration items" toggle', enabled && allowRegistrationItems.length > 0);
            await this.expect(defaultServicesEndDateInput(), '"Default services end date" input').toHaveValue(defaultServicesEndDate);
        }
    }
}