import SettingsPage from './SettingsPage.js';
/** @typedef {import('../utils/types.js').WidgetOptions} WidgetOptions */

export default class WidgetSettingsPage extends SettingsPage {

    /**
   * @param {import('@playwright/test').Page} page
   * @param {string} baseURL
   * @param {import('@playwright/test').Expect} expect
   * @param {import('@playwright/test').Request} request
   * @param {import('../base/BackOffice.js')} backOffice
   * @param {import('../utils/SeQuraHelper.js')} helper
   * @param {string} pageHash Page hash to navigate to
   */
    constructor(page, baseURL, expect, request, backOffice, helper) {
        super(page, baseURL, expect, request, backOffice, helper, 'settings-widget');
    }

    /**
    * Init the locators with the locators available
    * 
    * @returns {Object}
    */
    initLocators() {
        return {
            ...super.initLocators(),
            widgetConfiguratorTextarea: () => this.page.locator('[name="widget-configurator-input"]'),

            selForPriceInput: () => this.page.locator('[name="productPriceSelector"]'),
            selForAltPriceInput: () => this.page.locator('[name="altProductPriceSelector"]'),
            selForAltPriceTriggerInput: () => this.page.locator('[name="altProductPriceTriggerSelector"]'),
            selForDefaultLocationInput: () => this.page.locator('[name="defaultProductLocationSelector"]'),

            customLocationsDetails: () => this.page.locator('.sq-locations-container details'),
            customLocationsAddBtn: () => this.page.locator('.sq-locations-container .sq-add'),
            customLocationPaymentMethodSelect: details => details.locator('select'),
            customLocationDisplayToggle: (details, locate = 'input') => {
                const loc = details.locator('.sq-toggle')
                return locate === 'input' ? loc.locator(locate) : loc;
            },
            customLocationLocationInput: details => details.locator('input[type="text"]'),
            customLocationWidgetConfigTextarea: details => details.locator('textarea'),

            selForCartPriceInput: () => this.page.locator('[name="cartPriceSelector"]'),
            selForCartLocationInput: () => this.page.locator('[name="cartLocationSelector"]'),
            cartPaymentMethodSelectContainer: () => this.page.locator('.sqm--table-dropdown.sq-cart-related-field'),

            selForProductListingPriceInput: () => this.page.locator('[name="listingPriceSelector"]'),
            selForProductListingLocationInput: () => this.page.locator('[name="listingLocationSelector"]'),
            productListingPaymentMethodSelectContainer: () => this.page.locator('.sqm--table-dropdown.sq-listing-related-field'),

            displayWidgetInProductToggle: (locate = 'input') => this.locators.toggle(this.page.getByRole('heading', { name: 'Display widget on product page' }), locate),
            displayWidgetInCartToggle: (locate = 'input') => this.locators.toggle(this.page.getByRole('heading', { name: 'Show installment amount in cart page' }), locate),
            displayWidgetInListingToggle: (locate = 'input') => this.locators.toggle(this.page.getByRole('heading', { name: 'Show installment amount in product listing' }), locate),
        };
    }

    /**
     * Fill the widget settings form
     * 
     * @param {WidgetOptions} options
     */
    async fillForm(options) {
        const { widgetConfig, product, cart, productListing } = options;
        const {
            widgetConfiguratorTextarea,
            displayWidgetInProductToggle,
            displayWidgetInCartToggle,
            displayWidgetInListingToggle
        } = this.locators;
        // Fill the widget styles
        await widgetConfiguratorTextarea().fill(widgetConfig);

        try {
            await this.setToggle({ enabled: product.display }, displayWidgetInProductToggle, '"Display widget on product page" toggle');
        } catch (e) {
            // Ignore, toggle is already in the desired state
        }
        if (product.display) {
            const {
                selForPriceInput,
                selForAltPriceInput,
                selForAltPriceTriggerInput,
                selForDefaultLocationInput,
                customLocationsDetails,
                customLocationsAddBtn,
                customLocationPaymentMethodSelect,
                customLocationDisplayToggle,
                customLocationLocationInput,
                customLocationWidgetConfigTextarea
            } = this.locators;
            // Fill the product page selectors
            await selForPriceInput().fill(product.priceSel);
            await selForAltPriceInput().fill(product.altPriceSel);
            await selForAltPriceTriggerInput().fill(product.altPriceTriggerSel);
            await selForDefaultLocationInput().fill(product.locationSel);

            // Setup custom locations
            await this.removeAllDetails(customLocationsDetails);
            for (const customLocation of product.customLocations) {
                await customLocationsAddBtn().click();
                const details = await customLocationsDetails().last();
                await customLocationPaymentMethodSelect(details).selectOption({ label: customLocation.paymentMethod });
                await this.openDetails(details);

                if (!customLocation.display) {
                    await customLocationDisplayToggle(details, 'label').click();
                }

                await customLocationLocationInput(details).fill(customLocation.locationSel);
                await customLocationWidgetConfigTextarea(details).fill(customLocation.widgetConfig);
            }
        }

        try {
            await this.setToggle({ enabled: cart.display }, displayWidgetInCartToggle, '"Show installment amount in cart page" toggle');
        } catch (e) {
            // Ignore, toggle is already in the desired state
        }
        if (cart.display) {
            const {
                selForCartPriceInput,
                selForCartLocationInput,
                cartPaymentMethodSelectContainer,
                dropdownButton,
                dropdownListItem,
                dropdownSelectedListItem
            } = this.locators;
            // Fill the cart page selectors
            await selForCartPriceInput().fill(cart.priceSel);
            await selForCartLocationInput().fill(cart.locationSel);
            await dropdownButton(cartPaymentMethodSelectContainer()).click();
            await dropdownListItem(cart.paymentMethod, cartPaymentMethodSelectContainer()).click();
            await this.expect(dropdownSelectedListItem(cart.paymentMethod, cartPaymentMethodSelectContainer()), `The payment method "${cart.paymentMethod}" is shown as selected`).toBeVisible();
        }

        try {
            await this.setToggle({ enabled: productListing.display }, displayWidgetInListingToggle, '"Show installment amount in product listing" toggle');
        } catch (e) {
            // Ignore, toggle is already in the desired state
        }
        if (productListing.display) {
            const {
                selForProductListingPriceInput,
                selForProductListingLocationInput,
                productListingPaymentMethodSelectContainer,
                dropdownButton,
                dropdownListItem,
                dropdownSelectedListItem
            } = this.locators;
            if (productListing.useSelectors) {
                // Fill the listing page selectors
                await selForProductListingPriceInput().fill(productListing.priceSel);
                await selForProductListingLocationInput().fill(productListing.locationSel);
            }
            await dropdownButton(productListingPaymentMethodSelectContainer()).click();
            await dropdownListItem(productListing.paymentMethod, productListingPaymentMethodSelectContainer()).click();
            await this.expect(dropdownSelectedListItem(productListing.paymentMethod, productListingPaymentMethodSelectContainer()), `The payment method "${productListing.paymentMethod}" is shown as selected`).toBeVisible();
        }
    }

    /**
     * Expect the configuration to match the provided options
     * 
     * @param {WidgetOptions} options
     */
    async expectConfigurationMatches(options) {
        await this.expect(this.locators.widgetConfiguratorTextarea()).toHaveValue(options.widgetConfig);
        await this.expectToBeChecked(this.locators.displayWidgetInProductToggle(), '"Display widget on product page" toggle', options.product.display);
        if (options.product.display) {
            await this.expect(this.locators.selForPriceInput()).toHaveValue(options.product.priceSel);
            await this.expect(this.locators.selForAltPriceInput()).toHaveValue(options.product.altPriceSel);
            await this.expect(this.locators.selForAltPriceTriggerInput()).toHaveValue(options.product.altPriceTriggerSel);
            await this.expect(this.locators.selForDefaultLocationInput()).toHaveValue(options.product.locationSel);

            const customLocationDetailsLocator = this.locators.customLocationsDetails();
            this.expect((await customLocationDetailsLocator.count())).toBe(options.product.customLocations.length);

            for (let i = 0; i < options.product.customLocations.length; i++) {
                const customLocation = options.product.customLocations[i];
                const details = customLocationDetailsLocator.nth(i);

                await this.expect(this.locators.customLocationPaymentMethodSelect(details)).toHaveValue(customLocation.paymentMethod);
                await this.openDetails(details);
                await this.expect(this.locators.customLocationDisplayToggle(details)).toBeChecked({ checked: customLocation.display });
                await this.expect(this.locators.customLocationLocationInput(details)).toHaveValue(customLocation.locationSel);
                await this.expect(this.locators.customLocationWidgetConfigTextarea(details)).toHaveValue(customLocation.widgetConfig);
            }
        }

        await this.expectToBeChecked(this.locators.displayWidgetInCartToggle(), '"Show installment amount in cart page" toggle', options.cart.display);
        if (options.cart.display) {
            await this.expect(this.locators.selForCartPriceInput()).toHaveValue(options.cart.priceSel);
            await this.expect(this.locators.selForCartLocationInput()).toHaveValue(options.cart.locationSel);
            await this.expect(dropdownSelectedListItem(options.cart.paymentMethod, this.locators.cartPaymentMethodSelectContainer()), `The payment method "${options.cart.paymentMethod}" is shown as selected`).toBeVisible();
        }

        await this.expectToBeChecked(this.locators.displayWidgetInListingToggle(), '"Show installment amount in product listing" toggle', options.productListing.display);
        if (options.productListing.display) {
            if (options.productListing.useSelectors) {
                await this.expect(this.locators.selForProductListingPriceInput()).toHaveValue(options.productListing.priceSel);
                await this.expect(this.locators.selForProductListingLocationInput()).toHaveValue(options.productListing.locationSel);
            }
            
            await this.expect(this.locators.dropdownSelectedListItem(options.productListing.paymentMethod, this.locators.productListingPaymentMethodSelectContainer()), `The payment method "${options.productListing.paymentMethod}" is shown as selected`).toBeVisible();
        }
    }
}