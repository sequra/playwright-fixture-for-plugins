import Fixture from '../base/Fixture.js';
/** @typedef {import('./types.js').WidgetOptions} WidgetOptions */

/**
 * Provide data for the tests
 */
export default class DataProvider extends Fixture {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {string} baseURL
     * @param {import('@playwright/test').Expect} expect
     * @param {import('@playwright/test').Request} request
     */
    constructor(page, baseURL, expect, request) {
        super(page, baseURL, expect);
        this.request = request;
    }

    /**
     * Data for PaymentMethodsSettingsPage
     * @param {string} merchantRef Options: dummy_automated_tests
     * @returns {Array<Object>}
     */
    countriesPaymentMethods(merchantRef = 'dummy_automated_tests') {
        switch (merchantRef) {
            case 'dummy_automated_tests':
                return [
                    { name: 'Spain', paymentMethods: ['Paga Después', 'Divide tu pago en 3', 'Paga Fraccionado'] },
                    { name: 'France', paymentMethods: ['Payez en plusieurs fois'] },
                    { name: 'Italy', paymentMethods: ['Pagamento a rate'] },
                    { name: 'Portugal', paymentMethods: ['Pagamento Fracionado'] }
                ];
            default:
                throw new Error(`Invalid merchant reference "${merchantRef}"`);
        }
    }

    /**
     * Data for PaymentMethodsSettingsPage
     * @param {string} username Options: dummy_automated_tests
     * @returns {Array<Object>}
     */
    countriesMerchantRefs(username = 'dummy_automated_tests') {
        switch (username) {
            case 'dummy_automated_tests':
                return [
                    { code: 'ES', name: 'Spain', merchantRef: 'dummy_automated_tests' },
                    { code: 'FR', name: 'France', merchantRef: 'dummy_automated_tests_fr' },
                    { code: 'IT', name: 'Italy', merchantRef: 'dummy_automated_tests_it' },
                    { code: 'PT', name: 'Portugal', merchantRef: 'dummy_automated_tests_pt' }
                ];
            default:
                throw new Error(`Invalid username "${username}"`);
        }
    }

    /**
     * For filling the checkout form
     * 
     * @param {string} alias Use:
     * - approve: For placing an approved 🍊 order 
     * - cancel: For placing a cancelled 🍊 order
     * - nonSpecial: For placing a normal order
     * @returns {Object}
     */
    shopper(alias = 'nonSpecial') {
        const shopper = {
            email: 'test@sequra.es',
            firstName: 'Fulano',
            lastName: 'De Tal',
            address1: "Carrer d'Alí Bei, 7",
            country: 'ES',
            city: 'Barcelona',
            state: 'Barcelona',
            postcode: '08010',
            phone: '666666666',
            dateOfBirth: '01/01/2000',
            dni: '23232323T',
            creditCard: {
                number: '4716773077339777',
                exp: '12/30',
                cvc: '123',
            },
            otp: ['6', '6', '6', '6', '6']
        };

        switch (alias) {
            case 'approve':
                return {
                    ...shopper,
                    firstName: 'Review Test Approve',
                    lastName: 'Review Test Approve',
                };
            case 'cancel':
                return {
                    ...shopper,
                    firstName: 'Review Test Cancel',
                    lastName: 'Review Test Cancel',
                };
            case 'nonSpecial':
                return shopper;
            default:
                throw new Error(`Invalid merchant reference "${alias}"`);
        }
    }

    /**
     * Checkout payment methods
     * 
     * @param {string} merchantRef 
     * @returns {Array<Object>} 
     */
    checkoutPaymentMethods(merchantRef = 'dummy_automated_tests') {
        switch (merchantRef) {
            case 'dummy_automated_tests':
                return [
                    { title: 'Recibe tu compra antes de pagar', product: 'i1', checked: false },
                    { title: 'Divide en 3 partes de ', product: 'sp1', checked: false },
                    { title: 'Paga Fraccionado desde ', product: 'pp3', checked: false }
                ];
            default:
                throw new Error(`Invalid merchant reference "${merchantRef}"`);
        }
    }

    /**
     * Get the public IP address currently used
     * @returns {Promise<string>}
     */
    async publicIP() {
        const response = await this.request.get('https://checkip.amazonaws.com/');
        const publicIP = await response.text();
        return publicIP.trim();
    }

    /**
     * Configuration for the widget form. Everything is set to false
     * @returns {WidgetOptions} Configuration for the widget
     */
    defaultWidgetOptions() {
        return {
            widgetConfig: '{"alignment":"center","amount-font-bold":"true","amount-font-color":"#1C1C1C","amount-font-size":"15","background-color":"white","border-color":"#B1AEBA","border-radius":"","class":"","font-color":"#1C1C1C","link-font-color":"#1C1C1C","link-underline":"true","no-costs-claim":"","size":"M","starting-text":"only","type":"banner"}',
            product: {
                display: false,
                priceSel: '',
                altPriceSel: '',
                altPriceTriggerSel: '',
                locationSel: '',
                customLocations: []
            },
            cart: {
                display: false,
                priceSel: '',
                locationSel: '',
                paymentMethod: 'Paga Fraccionado',
            },
            productListing: {
                display: false,
                useSelectors: true,
                priceSel: '',
                locationSel: '',
                paymentMethod: 'Paga Fraccionado',
            },
        }
    }

    /**
     * Configuration for the widget form with all options enabled
     * @returns {WidgetOptions} Configuration for the widget
     */
    widgetOptions() {
        const defaultOptions = this.defaultWidgetOptions();
        return {
            ...defaultOptions,
            product: {
                ...defaultOptions.product,
                display: true,
                customLocations: [
                    {
                        paymentMethod: 'Paga Después',
                        display: true,
                        locationSel: '',
                        widgetConfig: '{"alignment":"left","amount-font-bold":"true","amount-font-color":"#1C1C1C","amount-font-size":"15","background-color":"white","border-color":"#B1AEBA","border-radius":"","class":"","font-color":"#1C1C1C","link-font-color":"#1C1C1C","link-underline":"true","no-costs-claim":"","size":"M","starting-text":"only","type":"banner","branding":"black"}',
                    }
                ]
            },
            cart: {
                ...defaultOptions.cart,
                display: true
            },
            productListing: {
                ...defaultOptions.productListing,
                display: true
            },
        }
    }

    /**
     * Options having only product widget options enabled
     * @returns {WidgetOptions} Configuration for the widget with only product widget options
     */
    onlyProductWidgetOptions() {
        const widgetOptions = this.widgetOptions();
        return {
            ...widgetOptions,
            cart: {
                ...widgetOptions.cart,
                display: false
            },
            productListing: {
                ...widgetOptions.productListing,
                display: false
            }
        }
    }

    /**
     * Options having only cart widget options enabled
     * @returns {WidgetOptions} Configuration for the widget with only cart widget options
     */
    onlyCartWidgetOptions() {
        const widgetOptions = this.widgetOptions();
        return {
            ...widgetOptions,
            product: {
                ...widgetOptions.product,
                display: false
            },
            productListing: {
                ...widgetOptions.productListing,
                display: false
            }
        }
    }

    /**
     * Options having only product listing widget options enabled
     * @returns {WidgetOptions} Configuration for the widget with only product listing widget options
     */
    onlyProductListingWidgetOptions() {
        const widgetOptions = this.widgetOptions();
        return {
            ...widgetOptions,
            product: {
                ...widgetOptions.product,
                display: false
            },
            cart: {
                ...widgetOptions.cart,
                display: false
            }
        }
    }

    /**
     * Front end widget options
     * @param {string} product 
     * @param {string|null} campaign 
     * @param {number} amount
     * @param {number|null} registrationAmount 
     * @returns {FrontEndWidgetOptions} Options for the front end widget
     */
    frontEndWidgetOptions = (product, campaign, amount, registrationAmount) => {
        const widget = this.widgetOptions();
        return {
            locationSel: widget.product.locationSel,
            widgetConfig: widget.widgetConfig,
            product: product,
            amount: amount,
            registrationAmount: registrationAmount,
            campaign: campaign
        };
    }

    /**
     * @returns {FrontEndWidgetOptions} Options for the i1 widget
     */
    pp3FrontEndWidgetOptions = () => {
        throw new Error(`Unimplemented method "pp3FrontEndWidgetOptions"`);
    }

    /**
     * @returns {FrontEndWidgetOptions} Options for the sp1 widget
     */
    sp1FrontEndWidgetOptions = () => {
        throw new Error(`Unimplemented method "sp1FrontEndWidgetOptions"`);
    }

    /**
     * @returns {FrontEndWidgetOptions} Options for the i1 widget
     */
    i1FrontEndWidgetOptions = () => {
        throw new Error(`Unimplemented method "i1FrontEndWidgetOptions"`);
    }
}