import Fixture from '../base/Fixture.js';
/** @typedef {import('./types.js').WidgetOptions} WidgetOptions */
/** @typedef {import('./types.js').DeploymentTargetOptions} DeploymentTargetOptions */
/** @typedef {import('./types.js').FrontEndWidgetOptions} FrontEndWidgetOptions */

/**
 * Provide data for the tests
 */
export default class DataProvider extends Fixture {
    static DEFAULT_USERNAME = 'dummy_automated_tests';
    static SERVICE_USERNAME = 'dummy_services_automated_tests';
    static PRODUCT_WIDGET = 'product';
    static CART_WIDGET = 'cart';

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
     * @param {string} username Options: DataProvider.DEFAULT_USERNAME
     * @returns {Array<Object>}
     */
    countriesPaymentMethods(username = DataProvider.DEFAULT_USERNAME) {
        switch (username) {
            case DataProvider.DEFAULT_USERNAME:
                return [
                    { name: 'France', paymentMethods: ['Payez en plusieurs fois'] },
                    { name: 'Spain', paymentMethods: ['Paga Después', 'Divide tu pago en 3', 'Paga Fraccionado'] },
                    { name: 'Italy', paymentMethods: ['Pagamento a rate'] },
                    { name: 'Portugal', paymentMethods: ['Pagamento Fracionado'] }
                ];
            default:
                throw new Error(`Invalid username "${username}"`);
        }
    }

    /**
     * Data for PaymentMethodsSettingsPage
     * @param {string} username Options: DataProvider.DEFAULT_USERNAME, DataProvider.SERVICE_USERNAME
     * @returns {Array<Object>}
     */
    countriesMerchantRefs(username = DataProvider.DEFAULT_USERNAME) {
        switch (username) {
            case DataProvider.DEFAULT_USERNAME:
                return [
                    { code: 'FR', name: 'France', merchantRef: 'dummy_automated_tests_fr' },
                    { code: 'ES', name: 'Spain', merchantRef: DataProvider.DEFAULT_USERNAME },
                    { code: 'IT', name: 'Italy', merchantRef: 'dummy_automated_tests_it' },
                    { code: 'PT', name: 'Portugal', merchantRef: 'dummy_automated_tests_pt' }
                ];
            case DataProvider.SERVICE_USERNAME:
                return [
                    { code: 'ES', name: 'Spain', merchantRef: DataProvider.SERVICE_USERNAME }
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
                name: 'SEQURA TEST'
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
     * @param {string} merchantRef By default, it uses DataProvider.DEFAULT_USERNAME
     * @returns {Array<Object>} 
     */
    checkoutPaymentMethods(merchantRef = DataProvider.DEFAULT_USERNAME) {
        switch (merchantRef) {
            case DataProvider.DEFAULT_USERNAME:
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
     * @param {Object} options Allows extending the default behavior by defining additional options.
     * @returns {WidgetOptions} Configuration for the widget
     */
    defaultWidgetOptions(options = {}) {
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
                product: 'pp3',
                paymentMethod: 'Paga Fraccionado',
            },
            productListing: {
                display: false,
                useSelectors: true,
                priceSel: '',
                locationSel: '',
                product: 'pp3',
                paymentMethod: 'Paga Fraccionado',
            },
        }
    }

    /**
     * Configuration for the widget form with all options enabled
     * @param {Object} options Allows extending the default behavior by defining additional options.
     * @returns {WidgetOptions} Configuration for the widget
     */
    widgetOptions(options = {}) {
        const defaultOptions = this.defaultWidgetOptions();
        return {
            ...defaultOptions,
            product: {
                ...defaultOptions.product,
                display: true,
                customLocations: [
                    {
                        paymentMethod: 'Paga Después',
                        product: 'i1',
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
     * @param {Object} options Allows extending the default behavior by defining additional options.
     * @returns {WidgetOptions} Configuration for the widget with only product widget options
     */
    onlyProductWidgetOptions(options = {}) {
        const widgetOptions = this.widgetOptions(options);
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
     * @param {Object} options Allows extending the default behavior by defining additional options.
     * @returns {WidgetOptions} Configuration for the widget with only cart widget options
     */
    onlyCartWidgetOptions(options = {}) {
        const widgetOptions = this.widgetOptions(options);
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
     * @param {Object} options Allows extending the default behavior by defining additional options.
     * @returns {WidgetOptions} Configuration for the widget with only product listing widget options
     */
    onlyProductListingWidgetOptions(options = {}) {
        const widgetOptions = this.widgetOptions(options);
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
     * @param {Object} options Allows extending the default behavior by defining additional options.
     * @param {string} options.widgetType Optional. Specifies the widget type in use. Possible values are DataProvider.PRODUCT_WIDGET, DataProvider.CART_WIDGET. Default is DataProvider.PRODUCT_WIDGET.
     * @returns {FrontEndWidgetOptions} Options for the front end widget
     */
    frontEndWidgetOptions = (product, campaign, amount, registrationAmount, options = {}) => {
        const { widgetType = DataProvider.PRODUCT_WIDGET } = options;
        const widget = this.widgetOptions(options);

        const commonProps = {
            product: product,
            amount: amount,
            registrationAmount: registrationAmount,
            campaign: campaign
        };

        const customLocation = widget.product.customLocations.find(cl => cl.product === product);

        return ({
            [DataProvider.PRODUCT_WIDGET]: {
                ...commonProps,
                display: customLocation ? customLocation.display : widget.product.display,
                locationSel: customLocation?.locationSel || widget.product.locationSel,
                widgetConfig: customLocation?.widgetConfig || widget.widgetConfig
            },
            [DataProvider.CART_WIDGET]: {
                ...commonProps,
                display: widget.cart.display && product === widget.cart.product,
                locationSel: widget.cart.locationSel,
                widgetConfig: widget.widgetConfig
            }
        })[widgetType];
    }

    /**
     * @param {Object} options Additional options to configure the widget
     * @returns {FrontEndWidgetOptions} Options for the pp3 widget
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
    * @param {string} options.product SeQura product. Optional. Default is 'pp3'
    * @param {string|null} options.campaign Campaign identifier. Optional. Default is null
    * @param {number} options.amount cart amount
    * @param {number|null} options.registrationAmount registration amount
    * @returns {FrontEndWidgetOptions} Options for the cart widget
    */
    cartFrontEndWidgetOptions = (options) => {
        const { product = 'pp3', campaign = null, amount, registrationAmount } = options;
        return this.frontEndWidgetOptions(product, campaign, amount, registrationAmount, {...options, widgetType: DataProvider.CART_WIDGET});
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