
/**
 * @typedef {Object} WidgetOptionsProductCustomLocation
 * @property {string} paymentMethod The payment method for the custom location
 * @property {boolean} display Whether the custom location is displayed
 * @property {string} locationSel The selector for the custom location element in the product page
 * @property {string} widgetConfig The widget configuration for the custom location in the product page
 */

/**
 * @typedef {Object} WidgetOptionsProduct
 * @property {boolean} display Whether the widget is enabled in the product page
 * @property {string} priceSel The selector for the price element in the product page
 * @property {string} altPriceSel The selector for the alternative price element in the product page
 * @property {string} altPriceTriggerSel The selector for the alternative price trigger element in the product page
 * @property {string} locationSel The selector for the default location element in the product page
 * @property {Array<WidgetOptionsProductCustomLocation>} customLocations Custom locations for the widget in the product page
 */

/**
 * @typedef {Object} WidgetOptionsCart
 * @property {boolean} display Whether the widget is enabled in the cart page
 * @property {string} priceSel The selector for the price element in the cart page
 * @property {string} locationSel The selector for the default location element in the cart page
 * @property {string} paymentMethod The payment method for the cart mini widget
 */

/**
 * @typedef {Object} WidgetOptionsProductListing
 * @property {boolean} display Whether the widget is enabled in the product listing
 * @property {boolean} useSelectors A flag to indicate if selectors should be used for the product listing mini widget
 * @property {string} priceSel The selector for the price element in the product listing
 * @property {string} locationSel The selector for the default location element in the product listing
 * @property {string} paymentMethod The payment method for the product listing mini widget
 */

/**
 * @typedef {Object} WidgetOptions
 * @property {string} widgetConfig The configuration for the widget styles
 * @property {WidgetOptionsProduct} product Product page options
 * @property {WidgetOptionsCart} cart Cart page options
 * @property {WidgetOptionsProductListing} productListing Product listing page options
 */

/**
 * @typedef {Object} FrontEndWidgetOptions
 * @property {string} locationSel The selector for the location where the widget should be visible
 * @property {string} widgetConfig The widget configuration as a JSON string
 * @property {string} product The product type (e.g., 'pay_in_3', 'pay_later')
 * @property {number} amount The amount for the widget
 * @property {number} registrationAmount The registration amount for the widget
 * @property {string|null} campaign The campaign identifier, if applicable
 */

export { }