import BackOffice from "../base/BackOffice.js";
import Page from "./Page.js";

/**
 * Checkout page
 */
export default class CheckoutPage extends Page {

    /**
    * Hold CSS selectors used by several locators
    * 
    * @returns {Object}
    */
    initSelectors() {
        return {
            sqIframeI1: '#sq-identification-i1'
        };
    }

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            paymentMethods: opt => this.paymentMethodsLocator(opt),
            paymentMethodTitle: opt => this.paymentMethodTitleLocator(opt),
            paymentMethodInput: opt => this.paymentMethodInputLocator(opt),
            sqIframeI1: () => this.page.frameLocator(this.selectors.sqIframeI1),
            sqIframeI1Locator: () => this.page.locator(this.selectors.sqIframeI1),
            sqDateOfBirth: iframe => iframe.locator('[name="date_of_birth"]'),
            sqNin: iframe => iframe.locator('[name="nin"]'),
            sqAcceptPrivacyPolicy: iframe => iframe.locator('#sequra_privacy_policy_accepted'),
            sqIframeBtn: iframe => iframe.locator('.actions-section button:not([disabled])'),
            sqOtp1: iframe => iframe.locator('[aria-label="Please enter OTP character 1"]'),
            sqOtp2: iframe => iframe.locator('[aria-label="Please enter OTP character 2"]'),
            sqOtp3: iframe => iframe.locator('[aria-label="Please enter OTP character 3"]'),
            sqOtp4: iframe => iframe.locator('[aria-label="Please enter OTP character 4"]'),
            sqOtp5: iframe => iframe.locator('[aria-label="Please enter OTP character 5"]'),
            monthlyIncomeSelect: iframe => iframe.locator('#monthly_income'),
            monthlyFixedExpensesSelect: iframe => iframe.locator('#monthly_fixed_expenses'),
            moreInfoIframe: () => this.page.frameLocator('iframe'),
            moreInfoCloseBtn: () => this.locators.moreInfoIframe().locator('button[data-testid="close-popup"]'),
            moreInfoLink: options => this.moreInfoLinkLocator(options)
        };
    }

    /**
     * Navigate to the page
     * 
     * @param {Object} options Additional options
     * @returns {Promise<void>}
     */
    async goto(options = {}) {
        const url = this.checkoutUrl(options);
        if (this.page.url() === url) {
            // Do not reload the page if we are already on the checkout page
            return;
        }
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    /**
     * Provide the checkout URL
     * @param {Object} options
     * @returns {string} The checkout URL
     */
    checkoutUrl(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator to input the payment method
     * @param {Object} options
     * @param {string} options.product seQura product (i1, pp3, etc)
     * @param {boolean} options.checked Whether the payment method should be checked
     * @returns {import("@playwright/test").Locator}
     */
    paymentMethodInputLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator to input the payment method
     * @param {Object} options
     * @param {string} options.title Payment method title as it appears in the UI
     * @returns {import("@playwright/test").Locator}
     */
    paymentMethodTitleLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator seQura payment methods
     * @param {Object} options
     * @returns {import("@playwright/test").Locator}
     */
    paymentMethodsLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator for the moreInfo tag 
     * 
     * @param {Object} options
     * @returns {import("@playwright/test").Locator}
     */
    moreInfoLinkLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Fill the checkout page's form
     * @param {Object} options Contains the data to fill the form
     * @param {string} options.email Email
     * @param {string} options.firstName First name
     * @param {string} options.lastName Last name
     * @param {string} options.address1 Address first line
     * @param {string} options.country Typically a 2-letter ISO country code
     * @param {string} options.state Name of the state
     * @param {string} options.city Name of the city
     * @param {string} options.postcode Postcode
     * @param {string} options.phone Phone number
     * @param {string} options.shippingMethod Shipping method
     * @returns {Promise<void>}
     */
    async fillForm(options) {
        throw new Error('Not implemented');
    }

    /**
     * Expect payment method to be visible
     * @param {Object} options 
     * @param {string} options.title Payment method title as it appears in the UI
     * @param {string} options.product seQura product (i1, pp3, etc)
     * @param {boolean} options.checked Whether the payment method should be checked
     */
    async expectPaymentMethodToBeVisible(options) {
        const { title, product } = options;
        await this.expect(this.locators.paymentMethodInput(options), `"${product}" payment method input should be visible`).toBeVisible({ timeout: 10000 });
        await this.expect(this.locators.paymentMethodTitle(options), `"${title}" payment method should be visible`).toBeVisible({ timeout: 10000 });
    }

    /**
     * Expect at least one SeQura payment method to be available or not
     * @param {object} options 
     * @param {boolean} options.available Whether the payment methods should be available
     */
    async expectAnyPaymentMethod(options = { available: true }) {
        const { available = true } = options || {};
        const locator = this.locators.paymentMethods(options);
        if (available) {
            await this.expect(locator.first(), `"seQura payment methods should be available`).toBeVisible({ timeout: 10000 });
        } else {
            await this.expect(locator, `"seQura payment methods should not be available`).toHaveCount(0, { timeout: 10000 });
        }
    }

    /**
     * Select the payment method and place the order
     * @param {Object} options 
     * @param {string} options.product seQura product (i1, pp3, etc)
     */
    async placeOrder(options) {
        throw new Error('Not implemented');
    }

    /**
     * Fill OTP fields of the Checkout Form
     * @param {import("@playwright/test").FrameLocator} iframe
     * @param {Object} options Contains the data to fill the form
     * @param {string[]} options.otp Digits of the OTP
     * @returns {Promise<void>}
     */
    async fillOtp(iframe, options) {
        const { otp } = options;

        await this.locators.sqOtp1(iframe).waitFor({ state: 'attached', timeout: 10000 });
        await this.locators.sqOtp1(iframe).pressSequentially(otp[0]);
        await this.locators.sqOtp2(iframe).pressSequentially(otp[1]);
        await this.locators.sqOtp3(iframe).pressSequentially(otp[2]);
        await this.locators.sqOtp4(iframe).pressSequentially(otp[3]);
        await this.locators.sqOtp5(iframe).pressSequentially(otp[4]);

        await this.locators.sqIframeBtn(iframe).click();
    }

    /**
     * Fill checkout form for i1 product
     * 
     * @param {Object} options Contains the data to fill the form
     * @param {string} options.dateOfBirth Date of birth
     * @param {string} options.nin National identification number
     * @param {string[]} options.otp Digits of the OTP
     * @returns {Promise<void>}
     */
    async fillI1CheckoutForm(options) {
        const { dateOfBirth, nin } = options;
        await this.locators.sqIframeI1Locator().waitFor({ state: 'attached', timeout: 10000 });
        const iframe = this.locators.sqIframeI1();
        // First name, last name, and mobile phone came already filled.
        await this.locators.sqDateOfBirth(iframe).click();
        await this.locators.sqDateOfBirth(iframe).pressSequentially(dateOfBirth);
        await this.locators.sqNin(iframe).click();
        await this.locators.sqNin(iframe).pressSequentially(nin);
        await this.locators.sqAcceptPrivacyPolicy(iframe).click();
        await this.locators.sqIframeBtn(iframe).click();
        await this.fillOtp(iframe, options);
    }

    async fillPp3CheckoutForm(options) {
        const { dateOfBirth, nin } = options;
        await this.locators.sqIframeI1Locator().waitFor({ state: 'attached', timeout: 10000 });
        const iframe = this.locators.sqIframeI1();
        await this.locators.sqIframeBtn(iframe).click(); // Click to proceed with the selected payment plan
        // First name, last name, and mobile phone came already filled.
        await this.locators.sqDateOfBirth(iframe).click();
        await this.locators.sqDateOfBirth(iframe).pressSequentially(dateOfBirth);
        await this.locators.sqNin(iframe).click();
        await this.locators.sqNin(iframe).pressSequentially(nin);
        // Select Monthly income and Fixed monthly fees
        await this.locators.monthlyIncomeSelect(iframe).selectOption({ index: 1 });
        await this.locators.monthlyFixedExpensesSelect(iframe).selectOption({ index: 1 });

        await this.locators.sqAcceptPrivacyPolicy(iframe).click();
        await this.locators.sqIframeBtn(iframe).click();
        await this.fillOtp(iframe, options);
    }

    async fillSp1CheckoutForm(options) {
        throw new Error('Not implemented');
    }

    /**
     * Define the expected behavior after placing an order
     * @param {Object} options 
     */
    async waitForOrderSuccess(options) {
        throw new Error('Not implemented');
    }

    /**
     * Define the expected behavior after placing an order that is on hold
     * @param {Object} options 
     */
    async waitForOrderOnHold(options) {
        throw new Error('Not implemented');
    }

    /**
     * Read the order number from the success page
     * 
     * @returns {Promise<string>}
     */
    async getOrderNumber() {
        throw new Error('Not implemented');
    }

    /**
    * Expects the order to have the expected status
    * @param {Object} options 
    * @param {string} options.orderNumber The order number
    * @param {string} options.status The expected status
    * @param {int} options.waitFor The maximum amount of seconds to wait for the order status to change
    * @returns {Promise<void>}
    */
    async expectOrderHasStatus(options) {
        throw new Error('Not implemented');
    }

    /**
     * The timeout to wait before retrying to check the order status
     * @param {Object} options 
     * @returns {int}
     */
    getOrderStatusTimeoutInMs(options) {
        return 1000;
    }

    /**
    * Wait until the order to have the expected status or the timeout
    * @param {Object} options 
    * @param {string} options.orderNumber The order number
    * @param {string} options.status The expected status
    * @param {int} options.waitFor The maximum amount of seconds to wait for the order status to change
    */
    async waitForOrderStatus(options) {
        const { status, waitFor } = options;
        console.log(`Waiting for order has status "${status}" for ${waitFor} seconds...`);
        for (let i = 0; i < waitFor; i++) {
            try {
                await this.expectOrderHasStatus(options);
                console.log(`Order status changed to "${status}" after ${i} seconds`);
                break;
            } catch (err) {
                if (i >= waitFor) {
                    console.log(`Timeout: after ${i} seconds the order status didn't change to "${status}" `);
                    throw err
                }
                await this.page.waitForTimeout(this.getOrderStatusTimeoutInMs(options));
                await this.page.reload();
            }
        }
    }

    /**
     * Check if the order changes to the expected state
     * @param {BackOffice} backOffice
     * @param {Object} options
     * @param {string} options.toStatus The expected status
     * @param {string} options.fromStatus The initial status. Optional
     * @param {int} options.waitFor The maximum amount of seconds to wait for the order status to change
     */
    async expectOrderChangeTo(backOffice, options) {
        throw new Error('Not implemented');
    }

     /**
     * Test if the "+ info" link is working properly
     * @param {Object} options
     * @param {string} options.product seQura product (i1, pp3, etc)
     * @param {string} options.campaign Campaign name
     * @returns {Promise<void>}
     */
     async openAndCloseEducationalPopup(options) {  
        await this.locators.moreInfoLink(options).click();
        await this.locators.moreInfoCloseBtn().click();
    }
}