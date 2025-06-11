import SettingsPage from './SettingsPage.js';
// import { countries as dataCountries } from './data';

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
            enabledForServicesToggle: (locate = 'input') => this.locators.toggle(this.page.getByRole('heading', { name: 'Enabled for services' }), locate),
            allowFirstServicePaymentDelayToggle: (locate = 'input') => this.locators.toggle(this.page.getByRole('heading', { name: 'Allow first service payment delay' }), locate),
            allowRegistrationItemsToggle: (locate = 'input') => this.locators.toggle(this.page.getByRole('heading', { name: 'Allow registration items' }), locate),
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
     * @param {object} options
     * @param {boolean} options.enabled 
     */
    async expectEnabledForServicesToBe(options) {
        const { enabled } = options;
        await this.expectToBeChecked(this.locators.enabledForServicesToggle(), '"Enable for service" toggle', enabled);
        await this.expectToBeVisible(this.locators.allowFirstServicePaymentDelayToggle('label'), '"Allow First Service Payment Delay" toggle', enabled);
        await this.expectToBeVisible(this.locators.allowRegistrationItemsToggle('label'), '"Allow registration items" toggle', enabled);
        await this.expectToBeVisible(this.locators.defaultServicesEndDateInput(), '"Default services end date" input', enabled);
    }

    /**
     * @param {object} options 
     * @param {boolean} options.enabled
     */
    async setEnabledForServices(options) {
        this.setToggle(options, this.locators.enabledForServicesToggle, 'Enable for services');
        await this.expectEnabledForServicesToBe(options);
    }

    /**
     * @param {object} options 
     * @param {boolean} options.enabled 
     */
    async setAllowFirstServicePaymentDelay(options) {
        this.setToggle(options, this.locators.allowFirstServicePaymentDelayToggle, 'Allow First Service Payment Delay');
    }

    /**
     * @param {object} options 
     * @param {boolean} options.enabled 
     */
    async setAllowRegistrationItems(options) {
        this.setToggle(options, this.locators.allowRegistrationItemsToggle, 'Allow Registration Items');
    }

    /**
     * @param {string} value 
     */
    async fillDefaultServicesEndDate(value) {
        const { defaultServicesEndDateInput } = this.locators;
        await defaultServicesEndDateInput.fill(value);
        await defaultServicesEndDateInput.blur();
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
        const { countryInput, selectedItem, countriesSelect } = this.locators;
        let value = '';
        for (const { code, name, merchantRef } of countries) {
            value += !value ? code : ',' + code;
            await this.expectToBeVisible(selectedItem(this.page, name), `Country "${name}"`, true);
            // const inputLocator = countryInput(code);
            // await this.expectToBeVisible(inputLocator, `Country Ref input for "${name}"`, true);
            // await this.expect(inputLocator, `Country Ref input for "${name}" should have value "${merchantRef}"`).toHaveValue(merchantRef);
        }
        this.expect(countriesSelect(), `"countries-selector" input should have value "${value}"`).toHaveValue(value);
    }

    /**
      * Fill countries configuration form
      * @param {Object} options
      * @param {Array<Object>} options.countries The countries to select
      * @param {string} options.countries[].code The country code
      * @param {string} options.countries[].name The country name
      * @param {Array<string>} options.countries[].merchantRef The merchant reference
      */
    async fillAvailableCountries(options) {
        const { countries } = options;
        const { countriesMultiSelect, selectedItemRemoveButton, dropdownListVisible, dropdownListItem, countryInput, selectedItem, countriesSelect } = this.locators;
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
        for (const { code, name, merchantRef } of countries) {
            await dropdownListItem(name).click();
            // await countryInput(code).fill(merchantRef);
        }
        await this.closeDropdownList(countriesMultiSelect());
    }

    /**
     * Expect the country input error to be visible
     */
    async expectCountryInputErrorToBeVisible() {
        await this.expectToBeVisible(this.locators.countryInputError(), 'Country input error', true);
    }
}