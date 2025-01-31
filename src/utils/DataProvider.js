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
                throw new Error('Invalid merchant reference');
        }
    }

}