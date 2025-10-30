import BackOffice from "../base/BackOffice.js";
import DataProvider from "../utils/DataProvider.js";
import SeQuraHelper from "../utils/SeQuraHelper.js";
import Page from "./Page.js";
import SeQuraCheckoutForm from "../base/SeQuraCheckoutForm.js";

/**
 * Checkout page
 */
export default class CheckoutPage extends Page {

    /**
     * @param {import('@playwright/test').Page} page
     * @param {string} baseURL
     * @param {import('@playwright/test').Expect} expect
     * @param {import('@playwright/test').Request} request
     */
    constructor(page, baseURL, expect, request) {
        super(page, baseURL, expect, request);
        this.checkoutForm = new SeQuraCheckoutForm(page, baseURL, expect);
    }

    /**
     * Init the locators with the locators available
     * @returns {Object}
     */
    initLocators() {
        return {
            paymentMethods: opt => this.paymentMethodsLocator(opt),
            paymentMethodTitle: opt => this.paymentMethodTitleLocator(opt),
            paymentMethodInput: opt => this.paymentMethodInputLocator(opt),
            moreInfoIframe: () => this.page.frameLocator('iframe'),
            moreInfoCloseBtn: () => this.locators.moreInfoIframe().locator('button[data-testid="close-popup"]'),
            moreInfoLink: options => this.moreInfoLinkLocator(options)
        };
    }

    /**
     * Navigate to the page
     * 
     * @param {Object} options Additional options
     * @param {boolean} options.force Whether to force navigation even if we are already on the page
     * @returns {Promise<void>}
     */
    async goto(options = { force: false }) {
        const opt = { force: false, ...options };
        const url = this.checkoutUrl(opt);
        if (!opt.force && this.page.url() === url) {
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
     * @param {int} options.timeout Timeout for the expectation. Default is 10000 ms.
     * @return {Promise<void>}
     */
    async expectPaymentMethodToBeVisible(options) {
        const { title, product, timeout = 10000 } = options;
        await this.expect(this.locators.paymentMethodInput(options), `"${product}" payment method input should be visible`).toBeVisible({ timeout });
        await this.expect(this.locators.paymentMethodTitle(options), `"${title}" payment method should be visible`).toBeVisible({ timeout });
    }

    /**
     * Expect at least one SeQura payment method to be available or not
     * @param {object} options 
     * @param {boolean} options.available Whether the payment methods should be available
     * @param {int} options.timeout Timeout for the expectation. Default is 10000 ms.
     * @returns {Promise<void>}
     */
    async expectAnyPaymentMethod(options = { available: true }) {
        const { available = true, timeout = 10000 } = options || {};
        const locator = this.locators.paymentMethods(options);
        if (available) {
            await this.expect(locator.first(), `"seQura payment methods should be available`).toBeVisible({ timeout });
        } else {
            await this.expect(locator, `"seQura payment methods should not be available`).toHaveCount(0, { timeout });
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
     * Fill the credit card form
     * @param {import("@playwright/test").FrameLocator} iframe
     * @param {Object} options Contains the data to fill the form
     * @param {Object} options.creditCard Credit card
     * @param {string} options.creditCard.number Credit card number
     * @param {string} options.creditCard.exp Credit card expiration date
     * @param {string} options.creditCard.cvc Credit card CVC
     * @returns {Promise<void>}
     */
    async fillCreditCard(iframe, options) {
        await this.checkoutForm.fillCreditCard(iframe, options);
    }

    /**
     * Fill OTP fields of the Checkout Form
     * @param {import("@playwright/test").FrameLocator} iframe
     * @param {Object} options Contains the data to fill the form
     * @param {string[]} options.otp Digits of the OTP
     * @returns {Promise<void>}
     */
    async fillOtp(iframe, options) {
        await this.checkoutForm.fillOtp(iframe, options);
    }

    /**
     * Fill checkout form for i1 product
     * 
     * @param {Object} options Contains the data to fill the form
     * @param {string} options.dateOfBirth Date of birth. If not provided, the field will not be filled
     * @param {string} options.firstName First name. If not provided, the field will not be filled
     * @param {string} options.lastName Last name. If not provided, the field will not be filled
     * @param {string} options.phone Mobile phone number. If not provided, the field will not be filled
     * @param {string} options.nin National identification number. If not provided, the field will not be filled
     * @param {string} options.address1 Address. If not provided, the field will not be filled
     * @param {string} options.city City. If not provided, the field will not be filled
     * @param {string} options.postcode Postal code. If not provided, the field will not be filled
     * @param {string[]} options.otp Digits of the OTP
     * @returns {Promise<void>}
     */
    async fillI1CheckoutForm(options) {
        await this.checkoutForm.fillI1CheckoutForm(options);
    }

    /**
     * Fill checkout form for pp3 product
     * @param {Object} options Contains the data to fill the form
     * @param {string} options.dateOfBirth Date of birth. If not provided, the field will not be filled
     * @param {string} options.firstName First name. If not provided, the field will not be filled
     * @param {string} options.lastName Last name. If not provided, the field will not be filled
     * @param {string} options.phone Mobile phone number. If not provided, the field will not be filled
     * @param {string} options.nin National identification number. If not provided, the field will not be filled
     * @param {string} options.address1 Address. If not provided, the field will not be filled
     * @param {string} options.city City. If not provided, the field will not be filled
     * @param {string} options.postcode Postal code. If not provided, the field will not be filled
     * @param {string[]} options.otp Digits of the OTP
     * @param {Object} options.creditCard Credit card
     * @param {string} options.creditCard.number Credit card number
     * @param {string} options.creditCard.exp Credit card expiration date
     * @param {string} options.creditCard.cvc Credit card CVC
     * @returns {Promise<void>}
     */
    async fillPp3CheckoutForm(options) {
        await this.checkoutForm.fillPp3CheckoutForm(options);
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

    /**
     * Verifies if the placed order has the merchant ID defined for the address country
     * This requires the 'verify_order_has_merchant_id' webhook to be implemented
     * 
     * @param {string} country The country code
     * @param {SeQuraHelper} helper The back office helper instance
     * @param {DataProvider} dataProvider The data provider instance
     * @param {Object} options Additional options if needed
     * @param {boolean} options.isOrderForService Whether the order is for a service
     * @returns {Promise<void>}
     */
    async expectOrderHasTheCorrectMerchantId(country, helper, dataProvider, options = {}) {
        const { isOrderForService = false } = options;
        const merchantId = dataProvider.countriesMerchantRefs(
            isOrderForService ? DataProvider.SERVICE_USERNAME : DataProvider.DEFAULT_USERNAME
        ).filter(c => c.code === country)[0].merchantRef;
        const orderNumber = await this.getOrderNumber();
        await helper.executeWebhook({
            webhook: helper.webhooks.verify_order_has_merchant_id, args: [
                { name: 'order_id', value: orderNumber },
                { name: 'merchant_id', value: merchantId }
            ]
        });
    }
}