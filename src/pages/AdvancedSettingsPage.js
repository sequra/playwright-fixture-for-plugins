import SettingsPage from './SettingsPage.js';

/** @typedef {import('../utils/types.js').LogEntry} LogEntry */

export default class AdvancedSettingsPage extends SettingsPage {

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
        super(page, baseURL, expect, request, backOffice, helper, 'advanced-debug');
    }

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            ...super.initLocators(),
            noEntriesFound: () => this.page.getByRole('cell', { name: 'No entries found' }),
            enableLogsToggle: (locate = 'input') => this.locators.toggle(this.page, locate),
            reloadLogsButton: () => this.page.getByRole('button', { name: 'Reload' }),
            removeLogsButton: () => this.page.getByRole('button', { name: 'Remove' }),
            confirmRemoveLogsButton: () => this.page.locator('#sq-modal .sq-button.sqt--danger'),
            logEntry: (level, message) => this.page.locator('.sqm--log.sqm--log-' + level.toLowerCase(), { hasText: message }),
            firstLogEntry: () => this.page.locator('.sqm--log').first(),
            logPaginationActiveItem: () => this.page.locator('.datatable-pagination-list-item.sq-datatable__active'),
            severityDropdownButton: () => this.locators.dropdownButton(this.page.locator('.sq-single-select-dropdown'))
        };
    }


    /**
     * Check that the log is empty
     * 
     * @param {Object} options Optional extra options
     * @returns {Promise<void>} 
     */
    async expectLogIsEmpty(options = {}) {
        await this.locators.noEntriesFound().waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Enable or disable the logs
     *
     * @param {boolean} enable Whether to enable or disable the logs
     * @param {Object} options Optional extra options
     * @returns {Promise<void>}
     */
    async enableLogs(enable = true, options = {}) {
        options = { enabled: enable, ...options };
        await this.setToggle(options, this.locators.enableLogsToggle, 'Enable logs');
        await this.expectLoadingShowAndHide();
    }

    /**
     * Reload the logs
     * 
     * @returns {Promise<void>}
     */
    async reloadLogs() {
        await this.locators.reloadLogsButton().click();
        await this.expectLoadingShowAndHide();
    }

    /**
     * Remove all logs
     * 
     * @returns {Promise<void>}
     */
    async removeLogs() {
        const { removeLogsButton, confirmRemoveLogsButton } = this.locators;
        await removeLogsButton().click();
        await confirmRemoveLogsButton().waitFor({ state: 'visible' });
        await confirmRemoveLogsButton().click();
        await this.expectLoadingShowAndHide();
    }

    /**
     * Expect the log to have certain content
     * 
     * @param {Object} options
     * @param {Array<LogEntry>} options.expectedLogs Logs that should be present. Optional
     * @param {Array<LogEntry>} options.nonExpectedLogs Logs that should not be present. Optional
     * @returns {Promise<void>}
     */
    async expectLogHasContent(options = {}) {
        const { expectedLogs = [], nonExpectedLogs = [] } = options;
        const { logEntry, firstLogEntry } = this.locators;
        await this.expect(firstLogEntry(), 'Log datatable has content').toBeVisible();
        for (const { level, message } of expectedLogs) {
            await this.expect(logEntry(level, message), `Log of severity "${level}" found with message: ${message}`).toBeVisible();
        }
        for (const { level, message } of nonExpectedLogs) {
            await this.expect(logEntry(level, message), `Log of severity "${level}" not found with message: ${message}`).toHaveCount(0);
        }
    }

    /**
     * Expect the log pagination to be visible
     * 
     * @returns {Promise<void>}
     */
    async expectLogPaginationIsVisible() {
        await this.expect(this.locators.logPaginationActiveItem(), 'Logs pagination is visible').toBeVisible();
    }

    /**
     * Set the severity level for the logs
     * 
     * @param {string} severityLevel Use one of: 'DEBUG', 'INFO', 'WARNING', 'ERROR'
     * @returns {Promise<void>}
     */
    async setSeverityLevel(severityLevel) {
        await this.locators.severityDropdownButton().click();
        await this.locators.dropdownListItem(severityLevel).click();
        await this.expectLoadingShowAndHide();
    }
}