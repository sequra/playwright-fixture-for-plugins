import Page from './Page.js';

/**
 * Interface for interacting with a seQura settings page
 */
export default class SettingsPage extends Page {

    /**
     * @param {import('@playwright/test').Page} page
     * @param {string} baseURL
     * @param {import('@playwright/test').Expect} expect
     * @param {import('@playwright/test').Request} request
     * @param {import('../base/BackOffice')} backOffice
     * @param {import('../utils/SeQuraHelper')} helper
     * @param {string} pageHash Page hash to navigate to
     */
    constructor(page, baseURL, expect, request, backOffice, helper, pageHash) {
        super(page, baseURL, expect, request);
        this.backOffice = backOffice;
        this.helper = helper;
        this.pageHash = pageHash;
    }

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            pageLoader: isHidden => this.page.locator(`.sq-page-loader${isHidden ? '.sqs--hidden' : ':not(.sqs--hidden)'}`),
            primaryButton: () => this.page.locator('.sq-button.sqt--primary'),
            saveButton: () => this.page.locator('.sq-button.sqp-save:not([disabled])'),
            cancelButton: () => this.page.locator('.sq-button.sqp-cancel:not([disabled])'),
            inputError: () => this.page.locator('.sqp-input-error'),
            selectedOption: text => this.page.locator('span.sqs--selected', { hasText: text }),
            dropdownButton: () => this.page.locator('.sqp-dropdown-button'),
            dropdownListItem: text => this.page.locator('.sqp-dropdown-button + .sqp-dropdown-list .sqp-dropdown-list-item', { hasText: text }),
            dropdownSelectedListItem: text => this.page.locator('.sqp-dropdown-button > .sqs--selected', { hasText: text }),
            multiSelect: () => this.page.locator('.sq-multi-item-selector'),
            toggle: (parentLocator, locate = 'input') => parentLocator.locator(locate === 'label' ? '.sq-toggle' : '.sqp-toggle-input'),
            selectedItem: (locator, hasText = '') => {
                const loc = locator.locator('.sqp-selected-item');
                return hasText ? loc.filter({ hasText }) : loc;
            },
            selectedItemRemoveButton: (locator, hasText = '') => this.locators.selectedItem(locator, hasText).locator('.sqp-remove-button'),
        };
    }

    /**
     * Navigate to the page
     * 
     * @param {Object} options Additional options
     * @returns {Promise<void>}
     */
    async goto(options = {}) {
        await this.backOffice.gotoSeQuraSettings({ page: this.pageHash, ...options });
    }

    /**
     * Expect the loading spinner to show and hide
     * 
     * @returns {Promise<void>}
     */
    async expectLoadingShowAndHide() {
        const options = { state: 'attached', timeout: 10000 };
        await this.locators.pageLoader(false).waitFor(options);
        await this.locators.pageLoader(true).waitFor(options);
    }

    /**
      * Save the changes
      * 
      * @param {Object} options Options
      * @param {boolean} options.expectLoadingShowAndHide Expect the loading spinner to show and hide after saving
      * @param {boolean} options.skipIfDisabled Do nothing if the save button is disabled
      * @returns {Promise<void>}
      */
    async save(options = { expectLoadingShowAndHide: true, skipIfDisabled: false }) {
        const { expectLoadingShowAndHide = true, skipIfDisabled = false } = options || {};
        const saveBtnLocator = this.locators.saveButton();
        try {
            await saveBtnLocator.waitFor({ timeout: 1500 });
        } catch (e) {
            if (skipIfDisabled) {
                return;
            }
            throw e;
        }

        await saveBtnLocator.click({ timeout: 500 });
        if (expectLoadingShowAndHide) {
            await this.expectLoadingShowAndHide();
        }
    }

    /**
     * Cancel the changes
     * 
     * @returns {Promise<void>}
     */
    async cancel() {
        await this.locators.cancelButton().click();
    }

    /**
     * Verify if the page is showing an error message
     * 
     * @returns {Promise<void>}
     */
    async expectErrorMessageToBeVisible() {
        const opt = { timeout: 100 };
        await this.expect(this.locators.inputError()).toBeVisible(opt);
        await this.expect(this.locators.saveButton()).toHaveCount(0, opt);
        await this.expect(this.locators.cancelButton()).toHaveCount(0, opt);
    }

    /**
     * Expect the locator to be checked
     * @param {import('@playwright/test').Locator} locator 
     * @param {string} fieldName 
     * @param {boolean} value 
     */
    async expectToBeChecked(locator, fieldName, value) {
        await this.expect(locator, `${fieldName} should be ${value ? 'ON' : 'OFF'}`).toBeChecked({ checked: value });
    }

    /**
     * Expect the locator to be visible
     * @param {import('@playwright/test').Locator} locator 
     * @param {string} fieldName 
     * @param {boolean} value 
     */
    async expectToBeVisible(locator, fieldName, value) {
        await this.expect(locator, `${fieldName} should be ${value ? 'visible' : 'hidden'}`).toBeVisible({ visible: value });
    }

    /**
     * Set toggle ON/OFF
     * @param {object} options 
     * @param {boolean} options.enabled
     * @param {function} locator Must return a locator and receive an optional parameter locate with the value 'label' or 'input'
     * @param {*} fieldName The name of the field
     */
    async setToggle(options, locator, fieldName) {
        const { enabled } = options;
        await this.expectToBeChecked(locator(), `"${fieldName}" toggle`, !enabled);
        await locator('label').click();
    }

    /**
     * Close open dropdown
     * @param {import('@playwright/test').Locator} locator Dropdown locator
     */
    async closeDropdownList(locator) {
        // Do click out of the dropdown list to close it
        await locator.click({ force: true, position: { x: 0, y: -20 } });
    }
}