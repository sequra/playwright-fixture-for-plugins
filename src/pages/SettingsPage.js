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
            secondaryButton: () => this.page.locator('.sq-button.sqt--secondary:not([disabled])'),
            inputError: () => this.page.locator('.sqp-input-error'),
            selectedOption: text => this.page.locator('span.sqs--selected', { hasText: text }),
            dropdownButton: (parentLocator = null) => (parentLocator ?? this.page).locator('.sqp-dropdown-button'),
            dropdownListItem: (text, parentLocator = null) => (parentLocator ?? this.page).locator('.sqp-dropdown-button + .sqp-dropdown-list .sqp-dropdown-list-item', { hasText: text }),
            dropdownSelectedListItem: (text, parentLocator = null) => (parentLocator ?? this.page).locator('.sqp-dropdown-button > .sqs--selected', { hasText: text }),
            multiSelectSelectedListItem: (text, parentLocator = null) => (parentLocator ?? this.page).locator('.sq-multi-item-selector > .sqp-selected-item', { hasText: text }),
            dropdownListVisible: () => this.page.locator('.sqp-dropdown-list.sqs--show'),
            multiSelect: (parentLocator = null) => (parentLocator ?? this.page).locator('.sq-multi-item-selector'),
            toggle: (parentLocator, locate = 'input') => parentLocator.locator(locate === 'label' ? '.sq-toggle' : '.sqp-toggle-input'),
            radio: (value, locate = 'input', parentLocator = null) => {
                const parent = parentLocator ? parentLocator : this.page;
                return parent.locator(`.sq-radio-input [type="radio"][value="${value}"]` + (locate === 'label' ? ' + span' : ''))
            },
            selectedItem: (locator, hasText = '') => {
                const loc = locator.locator('.sqp-selected-item');
                return hasText ? loc.filter({ hasText }) : loc;
            },
            selectedItemRemoveButton: (locator, hasText = '') => this.locators.selectedItem(locator, hasText).locator('.sqp-remove-button'),
            detailsSummary: details => details.locator('summary'),
            detailsRemoveBtn: details => details.locator('.sq-remove'),
        };
    }

    /**
     * Open the details of a section
     * @param {import('@playwright/test').Locator} details Locator for the details section
     * @returns {Promise<void>}
     */
    async openDetails(details) {
        try {
            await this.expect(this.locators.detailsRemoveBtn(details)).toBeHidden({ timeout: 1 });
            const summary = this.locators.detailsSummary(details);
            const box = await summary.boundingBox();
            await summary.click({ position: { x: box.width - 8, y: box.height / 2 } }); // click on the expand button.
        } catch {
        }
    }

    /**
     * Remove all details from the page using a locator function
     * @param {function} detailsLocatorFn Must return a Locator to the details and receive no parameters
     */
    async removeAllDetails(detailsLocatorFn) {
        while ((await detailsLocatorFn().count()) > 0) {
            const details = detailsLocatorFn().last();
            await this.openDetails(details);
            await this.locators.detailsRemoveBtn(details).click();
        }
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
     * @param {Object} options Additional options
     * @param {string} options.state State to wait for. Default is 'attached'.
     * @param {number} options.timeout Timeout for the wait. Default is 30000 ms.
     * @returns {Promise<void>}
     */
    async expectLoadingShowAndHide(options = {}) {
        const { state = 'attached', timeout = 30000 } = options;
        await this.locators.pageLoader(false).waitFor({ state, timeout });
        await this.locators.pageLoader(true).waitFor({ state, timeout });
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
        // expect at least one error message to be visible
        this.expect((await this.locators.inputError().filter({ visible: true }).count())).toBeTruthy();

        await this.expect(this.locators.saveButton()).toHaveCount(0, opt);
        await this.expect(this.locators.cancelButton()).toHaveCount(0, opt);
    }

    /**
     * Expect the locator to be checked
     * @param {import('@playwright/test').Locator} locator 
     * @param {string} fieldName 
     * @param {boolean} value 
     * @param {number} timeout Timeout for the expectation. Default is null, which means default timeout will be used.
     */
    async expectToBeChecked(locator, fieldName, value, timeout = null) {
        const options = timeout !== null ? { checked: value, timeout: timeout } : { checked: value };
        await this.expect(locator, `${fieldName} should be ${value ? 'ON' : 'OFF'}`).toBeChecked(options);
    }

    /**
     * Expect the locator to be visible
     * @param {import('@playwright/test').Locator} locator 
     * @param {string} fieldName 
     * @param {boolean} value
     * @param {number} timeout Timeout for the expectation. Default is null, which means default timeout will be used.
     */
    async expectToBeVisible(locator, fieldName, value, timeout = null) {
        const options = timeout !== null ? { visible: value, timeout: timeout } : { visible: value };
        await this.expect(locator, `${fieldName} should be ${value ? 'visible' : 'hidden'}`).toBeVisible(options);
    }

    /**
     * Set toggle ON/OFF
     * @param {object} options 
     * @param {boolean} options.enabled
     * @param {function} locator Must return a locator and receive an optional parameter locate with the value 'label' or 'input'
     * @param {*} fieldName The name of the field
     * @param {number} timeout Timeout for the expectation. Default is null, which means default timeout will be used.
     * @returns {Promise<void>}
     */
    async setToggle(options, locator, fieldName, timeout = null) {
        const { enabled } = options;
        await this.expectToBeChecked(locator(), `"${fieldName}" toggle`, !enabled, timeout);
        await locator('label').click({ timeout: 0 });
    }

    /**
     * Close open dropdown
     * @param {import('@playwright/test').Locator} locator Dropdown locator
     * @returns {Promise<void>}
     */
    async closeDropdownList(locator) {
        await this.locators.dropdownListVisible().waitFor({ state: 'visible', timeout: 5000 });
        // Do click out of the dropdown list to close it
        await locator.click({ force: true, position: { x: 0, y: -20 } });
        await this.locators.dropdownListVisible().waitFor({ state: 'detached', timeout: 1000 });
    }
}