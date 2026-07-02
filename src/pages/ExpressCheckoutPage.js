import Fixture from "../base/Fixture.js";

/**
 * SeQura Express Checkout button.
 *
 * The button is rendered by the shared CDN library into `.sequra-express-checkout-button` on the
 * storefront surfaces (product, cart, mini-cart). This base owns the seQura-generic parts — the
 * button mount, the in-iframe trigger and the identification form — and leaves the per-surface
 * wrapper selector and the mini-cart opening to the platform subclass, since that markup is
 * produced by the platform's templates.
 */
export default class ExpressCheckoutPage extends Fixture {

    /**
     * Selector for the express wrapper on a given surface. Platform-specific.
     * @param {string} surface One of 'product', 'cart', 'mini-cart'.
     * @returns {string}
     */
    wrapperSelector(surface) {
        throw new Error('Not implemented');
    }

    /**
     * Open the mini-cart so its express button renders/becomes visible. Platform-specific.
     * @returns {Promise<void>}
     */
    async openMiniCart() {
        throw new Error('Not implemented');
    }

    /**
     * Init the locators available
     * @returns {Object}
     */
    initLocators() {
        return {
            wrapper: surface => this.page.locator(this.wrapperSelector(surface)),
            mount: surface => this.page.locator(`${this.wrapperSelector(surface)} .sequra-express-checkout-button`),
            // The only iframe inside the mount is the CDN button; target it structurally to stay locale-agnostic.
            button: surface => this.page.frameLocator(`${this.wrapperSelector(surface)} .sequra-express-checkout-button iframe`).getByRole('button'),
            identificationForm: () => this.page.locator('[id^="sq-identification-"]'),
        };
    }

    /**
     * Assert the express button is mounted and enabled on the given surface.
     * @param {string} surface One of 'product', 'cart', 'mini-cart'.
     * @returns {Promise<void>}
     */
    async expectButtonVisible(surface) {
        await this.expect(this.locators.mount(surface).first()).toBeVisible({ timeout: 15000 });
        await this.expect(this.locators.wrapper(surface).first())
            .not.toHaveClass(/sequra-express-checkout--disabled/);
    }

    /**
     * Click the button on the given surface and wait for the SeQura identification form.
     * @param {string} surface One of 'product', 'cart', 'mini-cart'.
     * @returns {Promise<void>}
     */
    async startCheckout(surface) {
        await this.locators.button(surface).first().click();
        await this.locators.identificationForm().first().waitFor({ state: 'visible', timeout: 20000 });
    }
}
