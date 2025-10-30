import Fixture from "./Fixture.js";

/**
 * SeQura's Checkout Form
 */
export default class SeQuraCheckoutForm extends Fixture {

    /**
     * Initialize the locators for the checkout form
     * @returns {Object}
     */
    initLocators() {
        return {
            iframe: product => this.page.frameLocator(`#sq-identification-${product}`),
            iframeLocator: product => this.page.locator(`#sq-identification-${product}`),
            firstName: iframe => iframe.locator('[name="given_names"]'),
            lastName: iframe => iframe.locator('[name="surnames"]'),
            phone: iframe => iframe.locator('[name="mobile_phone"]'),
            dateOfBirth: iframe => iframe.locator('[name="date_of_birth"]'),
            nin: iframe => iframe.locator('[name="nin"]'),
            address: iframe => iframe.locator('[name="address"]'),
            city: iframe => iframe.locator('[name="city"]'),
            postalCode: iframe => iframe.locator('[name="postal_code"]'),
            acceptPrivacyPolicy: iframe => iframe.locator('#sequra_privacy_policy_accepted'),
            acceptServiceDuration: iframe => iframe.locator('#sequra_service_duration_accepted'),
            iframeBtn: iframe => iframe.locator('.actions-section button:not([disabled])'),
            otp: (iframe, position) => iframe.locator(`[aria-label="Please enter OTP character ${position}"]`),
            newCreditCardButton: iframe => iframe.locator('.reuse-card-component .PaymentMethodsSelectionSection__actionsSection > .tlr-Button___tertiary_j9CJ-'),
            creditCardIframe: iframe => iframe.frameLocator('#mufasa-iframe'),
            creditCardName: iframe => this.locators.creditCardIframe(iframe).locator('#cardholder_name'),
            creditCardNumber: iframe => this.locators.creditCardIframe(iframe).locator('#cc-number'),
            creditCardExp: iframe => this.locators.creditCardIframe(iframe).locator('#cc-exp'),
            creditCardCsc: iframe => this.locators.creditCardIframe(iframe).locator('#cc-csc'),
            paymentButton: iframe => iframe.locator('.payment-btn-container button:not([disabled])'),
            monthlyIncomeSelect: iframe => iframe.locator('#monthly_income'),
            monthlyFixedExpensesSelect: iframe => iframe.locator('#monthly_fixed_expenses'),
            occupationSelect: iframe => iframe.locator('#occupation')
        };
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
        const { creditCard } = options;
        const { creditCardName, creditCardNumber, creditCardExp, creditCardCsc, paymentButton, newCreditCardButton } = this.locators;

        try {
            // Click the new credit card button if present.
            await newCreditCardButton(iframe).click({ timeout: 3000 });
        } catch (e) {
            // Do nothing, the button is not visible
        }

        await creditCardNumber(iframe).waitFor({ state: 'attached', timeout: 10000 });
        await creditCardNumber(iframe).pressSequentially(creditCard.number, { delay: 100 });
        await creditCardExp(iframe).pressSequentially(creditCard.exp, { delay: 100 });
        await creditCardCsc(iframe).pressSequentially(creditCard.cvc, { delay: 100 });
        // Check if cardholder name field is present and fill it if so
        if (await creditCardName(iframe).count() > 0) {
            await creditCardName(iframe).pressSequentially(creditCard.name, { delay: 100 });
        }
        await paymentButton(iframe).click();
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

        await this.locators.otp(iframe, 1).waitFor({ state: 'attached', timeout: 10000 });
        await this.locators.otp(iframe, 1).pressSequentially(otp[0]);
        await this.locators.otp(iframe, 2).pressSequentially(otp[1]);
        await this.locators.otp(iframe, 3).pressSequentially(otp[2]);
        await this.locators.otp(iframe, 4).pressSequentially(otp[3]);
        await this.locators.otp(iframe, 5).pressSequentially(otp[4]);

        await this.locators.iframeBtn(iframe).click();
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
        const { iframeLocator, acceptPrivacyPolicy, acceptServiceDuration, iframeBtn } = this.locators;
        await iframeLocator('i1').waitFor({ state: 'attached', timeout: 10000 });
        const iframe = this.locators.iframe('i1');
        await this.#fillPersonalInfo(iframe, options);
        await acceptPrivacyPolicy(iframe).click();
        // Accept service duration if the checkbox is present.
        if (await acceptServiceDuration(iframe).count() > 0) {
            await acceptServiceDuration(iframe).click();
        }
        await iframeBtn(iframe).click();
        await this.fillOtp(iframe, options);
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
        const { iframeLocator, monthlyIncomeSelect, monthlyFixedExpensesSelect, occupationSelect, acceptPrivacyPolicy, acceptServiceDuration, iframeBtn } = this.locators;
        await iframeLocator('pp3').waitFor({ state: 'attached', timeout: 10000 });
        const iframe = this.locators.iframe('pp3');
        await iframeBtn(iframe).click(); // Click to proceed with the selected payment plan
        await this.#fillPersonalInfo(iframe, options);
        // Select monthly income. This field might not be present in some countries
        if (await monthlyIncomeSelect(iframe).count() > 0) {
            await monthlyIncomeSelect(iframe).selectOption({ index: 1 });
        }
        // Select monthly fixed expenses. This field might not be present in some countries
        if (await monthlyFixedExpensesSelect(iframe).count() > 0) {
            await monthlyFixedExpensesSelect(iframe).selectOption({ index: 1 });
        }
        // Select occupation. This field might not be present in some countries
        if (await occupationSelect(iframe).count() > 0) {
            await occupationSelect(iframe).selectOption({ value: 'unemployed' });
        }

        await acceptPrivacyPolicy(iframe).click();
        // Accept service duration if the checkbox is present.
        if (await acceptServiceDuration(iframe).count() > 0) {
            await acceptServiceDuration(iframe).click();
        }
        await iframeBtn(iframe).click();
        await this.fillOtp(iframe, options);
        await this.fillCreditCard(iframe, options);
    }

    /**
     * Fill personal info fields in the iframe
     * 
     * @param {import("@playwright/test").FrameLocator} iframe Iframe containing the personal info fields
     * @param {Object} options Contains the data to fill the form
     * @param {string} options.firstName First name. If not provided, the field will not be filled
     * @param {string} options.lastName Last name. If not provided, the field will not be filled
     * @param {string} options.phone Mobile phone number. If not provided, the field will not be filled
     * @param {string} options.dateOfBirth Date of birth. If not provided, the field will not be filled
     * @param {string} options.nin National identification number. If not provided, the field will not be filled
     * @param {string} options.address1 Address. If not provided, the field will not be filled
     * @param {string} options.city City. If not provided, the field will not be filled
     * @param {string} options.postcode Postal code. If not provided, the field will not be filled
     * @return {Promise<void>}
     */
    async #fillPersonalInfo(iframe, options) {
        const { firstName = null, lastName = null, phone = null, dateOfBirth = null, nin = null, address1 = null, city = null, postcode = null } = options;
        if (firstName) {
            await this.locators.firstName(iframe).fill(firstName);
        }
        if (lastName) {
            await this.locators.lastName(iframe).fill(lastName);
        }
        if (phone) {
            await this.locators.phone(iframe).fill(phone);
        }
        if (dateOfBirth) {
            await this.locators.dateOfBirth(iframe).fill(dateOfBirth);
        }
        if (nin) {
            await this.locators.nin(iframe).fill(nin);
        }
        if (address1 && (await this.locators.address(iframe).count() > 0)) {
            await this.locators.address(iframe).fill(address1);
        }
        if (city && (await this.locators.city(iframe).count() > 0)) {
            await this.locators.city(iframe).fill(city);
        }
        if (postcode && (await this.locators.postalCode(iframe).count() > 0)) {
            await this.locators.postalCode(iframe).fill(postcode);
        }
    }
}