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
        };
    }

    /**
     * Navigate to the page
     * 
     * @param {Object} options Additional options
     * @params {string} options.slug The product slug
     * @returns {Promise<void>}
     */
    async goto(options = {}) {
        await this.page.goto(this.checkoutUrl(options), { waitUntil: 'domcontentloaded' });
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
     * @param {string} options.dni National identification number
     * @param {string[]} options.otp Digits of the OTP
     * @returns {Promise<void>}
     */
    async fillI1CheckoutForm(options) {
        const { dateOfBirth, dni } = options;
        await this.locators.sqIframeI1Locator().waitFor({ state: 'attached', timeout: 10000 });
        const iframe = this.locators.sqIframeI1();
        // First name, last name, and mobile phone came already filled.
        await this.locators.sqDateOfBirth(iframe).click();
        await this.locators.sqDateOfBirth(iframe).pressSequentially(dateOfBirth);
        await this.locators.sqNin(iframe).click();
        await this.locators.sqNin(iframe).pressSequentially(dni);
        await this.locators.sqAcceptPrivacyPolicy(iframe).click();
        await this.locators.sqIframeBtn(iframe).click();
        await this.fillOtp(iframe, options);
    }

    async fillPp3CheckoutForm(options) {
        throw new Error('Not implemented');
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
}