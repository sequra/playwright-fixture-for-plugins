import Fixture from '../base/Fixture.js';

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
    constructor(page, baseURL, expect) {
        super(page, baseURL, expect);
    }

    /**
     * Data for PaymentMethodsSettingsPage
     * @param {string} merchantRef 
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


}