import PageWithWidgets from "./PageWithWidgets.js";

/**
 * Cart page
 */
export default class CartPage extends PageWithWidgets {

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            ...super.initLocators(),
            couponInput: (opt = {}) => this.couponInputLocator(opt),
            applyCouponBtn: (opt = {}) => this.applyCouponBtnLocator(opt),
            removeCouponBtn: (opt = {}) => this.removeCouponBtnLocator(opt),
            quantityInput: (opt = {}) => this.quantityInputLocator(opt),
            updateCartBtn: (opt = {}) => this.updateCartBtnLocator(opt),
            expandCouponFormBtn: (opt = {}) => this.expandCouponFormBtnLocator(opt),
            cartIsEmptyText: (opt = {}) => this.cartIsEmptyTextLocator(opt),
            removeCartItemBtn: (opt = {}) => this.removeCartItemBtnLocator(opt)
        };
    }

    /**
     * Navigate to the page
     * 
     * @param {Object} options Additional options
     * @returns {Promise<void>}
     */
    async goto(options = {}) {
        const url = this.cartUrl(options);
        if (this.page.url() === url) {
            // Do not reload the page if we are already on the cart page
            return;
        }
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    /**
     * Provide the cart URL
     * @param {Object} options
     * @returns {string} The cart URL
     */
    cartUrl(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator for the coupon input
     * @param {Object} options Additional options if needed
     * @returns {import("@playwright/test").Locator}
     */
    couponInputLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator for the apply coupon button
     * @param {Object} options Additional options if needed
     * @returns {import("@playwright/test").Locator}
     */
    applyCouponBtnLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator for the remove coupon button
     * @param {Object} options Additional options if needed
     * @returns {import("@playwright/test").Locator}
     */
    removeCouponBtnLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator for the quantity input
     * @param {Object} options Additional options if needed
     * @returns {import("@playwright/test").Locator}
     */
    quantityInputLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator for the update cart button
     * @param {Object} options Additional options if needed
     * @returns {import("@playwright/test").Locator|null} The locator for the update cart button, or null if not applicable
     */
    updateCartBtnLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Some systems have a button to expand the coupon form
     * @param {Object} options Additional options if needed
     * @returns {import("@playwright/test").Locator|null} The locator for the expand coupon form button, or null if not applicable
     */
    expandCouponFormBtnLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator to look for the text when the cart is empty
     * @param {Object} options Additional options if needed
     * @returns {import("@playwright/test").Locator|null}
     */
    cartIsEmptyTextLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Provide the locator for the remove cart item buttons
     * @param {Object} options Additional options if needed
     * @returns {import("@playwright/test").Locator}
     */
    removeCartItemBtnLocator(options) {
        throw new Error('Not implemented');
    }

    /**
     * Apply a coupon to the cart
     * @param {string} coupon The coupon code to apply
     * @param {Object} options Additional options
     */
    async applyCoupon(coupon, options = {}) {
        const {
            expandCouponFormBtn,
            couponInput,
            applyCouponBtn,
            removeCouponBtn

        } = this.locators;

        const expandCouponFormBtnLoc = expandCouponFormBtn(options);
        if (expandCouponFormBtnLoc) {
            await expandCouponFormBtnLoc.click();
        }

        await couponInput(options).fill(coupon);
        await applyCouponBtn(options).click();
        await removeCouponBtn(options).first().waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Remove the coupon from the cart
     * 
     * @param {Object} options Additional options
     */
    async removeCoupon(options = {}) {
        const { removeCouponBtn } = this.locators;
        await removeCouponBtn(options).click();
        await this.expect(removeCouponBtn(options)).toHaveCount(0, { timeout: 10000 });
    }

    /**
     * Set the quantity of a product in the cart
     * @param {number} quantity The quantity to set
     * @param {Object} options Additional options
     */
    async setQuantity(quantity, options = {}) {
        const { quantityInput, updateCartBtn } = this.locators;
        await quantityInput(options).fill(`${quantity}`);
        const updateCartBtnLoc = updateCartBtn(options);
        if (updateCartBtnLoc) {
            await updateCartBtnLoc.click();
        }
    }

    /**
     * Empty the cart by removing all items one by one
     * @param {Object} options Additional options
     */
    async emptyCart(options = {}) {
        const { cartIsEmptyText, removeCartItemBtn } = this.locators;
        try {
            await this.expect(cartIsEmptyText(options)).toBeVisible({ timeout: 1000 });
            return; // The cart is already empty
        } catch (e) {
            // The cart is not empty, continue.
        }
        let qty = await removeCartItemBtn(options).count();
        while (qty > 0) {
            await removeCartItemBtn(options).first().click();
            qty -= 1;
            // Wait for the remove button to be removed from the DOM
            await this.expect(removeCartItemBtn(options)).toHaveCount(qty, { timeout: 10000 });
        }
    }
}