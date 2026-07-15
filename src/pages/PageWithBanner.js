import Page from "./Page.js";

/**
 * Base class for pages that can render a SeQura banner
 */
export default class PageWithBanner extends Page {

    /**
    * Init the locators with the locators available
    *
    * @returns {Object}
    */
    initLocators() {
        return {
            /**
             * Locator for the banner container
             * @returns {import('@playwright/test').Locator}
             */
            banner: () => this.page.locator('.sequra-banner'),
            /**
             * Locator for the banner image
             * @returns {import('@playwright/test').Locator}
             */
            bannerImage: () => this.page.locator('.sequra-banner img'),
            /**
             * Locator for the banner link wrapping the image
             * @returns {import('@playwright/test').Locator}
             */
            bannerLink: () => this.page.locator('.sequra-banner a'),
        };
    }

    /**
     * Expect the banner to be visible with the given image and, optionally, wrapped in a link
     *
     * @param {Object} options
     * @param {string} options.imageUrl Expected image src
     * @param {string|null} [options.linkUrl] Expected link href; when empty the image must render without a link wrapper
     * @returns {Promise<void>}
     */
    async expectBannerToBeVisible({ imageUrl, linkUrl = null }) {
        const { bannerImage, bannerLink } = this.locators;
        await this.expect(bannerImage()).toBeVisible();
        // Match a substring so the assertion is independent of the store's media base URL
        const src = await bannerImage().getAttribute('src');
        this.expect(src, `banner image src should contain "${imageUrl}"`).toContain(imageUrl);

        if (linkUrl) {
            const href = await bannerLink().getAttribute('href');
            this.expect(href, `banner link href should contain "${linkUrl}"`).toContain(linkUrl);
            await this.expect(bannerLink()).toHaveAttribute('target', '_blank');
        } else {
            await this.expect(bannerLink()).toHaveCount(0);
        }
    }

    /**
     * Expect no banner to be rendered
     *
     * @returns {Promise<void>}
     */
    async expectBannerNotToBeVisible() {
        await this.expect(this.locators.banner()).toHaveCount(0);
    }
}
