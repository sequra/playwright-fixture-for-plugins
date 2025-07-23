import Fixture from '../base/Fixture.js';
/** @typedef {import('./types.js').WidgetOptions} WidgetOptions */
/** @typedef {import('./types.js').DeploymentTargetOptions} DeploymentTargetOptions */

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
                    { name: 'France', paymentMethods: ['Payez en plusieurs fois'] },
                    { name: 'Spain', paymentMethods: ['Paga Después', 'Divide tu pago en 3', 'Paga Fraccionado'] },
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
                    { code: 'FR', name: 'France', merchantRef: 'dummy_automated_tests_fr' },
                    { code: 'ES', name: 'Spain', merchantRef: 'dummy_automated_tests' },
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
     * - spain: For placing a normal order in Spain
     * - france: For placing a normal order in France
     * @returns {Object}
     */
    shopper(alias = 'spain') {
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
            nin: '23232323T',
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
            case 'france':
                return {
                    ...shopper,
                    firstName: 'Monsieur',
                    lastName: 'Untel',
                    country: 'FR',
                    city: 'Paris',
                    state: 'Paris',
                    postcode: '75013',
                    phone: '667042676',
                    nin: '060212312345',
                    otp: ['4', '2', '6', '7', '6']
                };
            case 'spain':
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
     * @param {Object} options Additional options to configure the widget
     * @returns {FrontEndWidgetOptions} Options for the i1 widget
     */
    pp3FrontEndWidgetOptions = (options = {}) => {
        throw new Error(`Unimplemented method "pp3FrontEndWidgetOptions"`);
    }

    /**
     * @param {Object} options Additional options to configure the widget
     * @returns {FrontEndWidgetOptions} Options for the sp1 widget
     */
    sp1FrontEndWidgetOptions = (options = {}) => {
        throw new Error(`Unimplemented method "sp1FrontEndWidgetOptions"`);
    }

    /**
     * @param {Object} options Additional options to configure the widget
     * @returns {FrontEndWidgetOptions} Options for the i1 widget
     */
    i1FrontEndWidgetOptions = (options = {}) => {
        throw new Error(`Unimplemented method "i1FrontEndWidgetOptions"`);
    }

    /**
     * Options for the cart widget
    * @param {Object} options Additional options to configure the widget
    * @param {number} options.amount cart amount
    * @param {number|null} options.registrationAmount registration amount
    * @returns {FrontEndWidgetOptions} Options for the cart widget
    */
    cartFrontEndWidgetOptions = (options) => {
        const { amount, registrationAmount } = options;
        return this.frontEndWidgetOptions('pp3', null, amount, registrationAmount);
    }

    /**
     * Options for the deployment targets
     * @returns {Array<DeploymentTargetOptions>} Options for the deployment targets
     */
    deploymentTargetsOptions() {
        return [
            { name: 'seQura' },
            { name: 'SVEA' }
        ];
    }
}