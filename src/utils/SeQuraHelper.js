import Fixture from '../base/Fixture.js';

/** @typedef {import('../utils/types.js').WebhookOption} WebhookOption */

/**
 * Allow interaction with the seQura helper module backend
 */
export default class SeQuraHelper extends Fixture {
    /**
     * @param {import('@playwright/test').Page} page
     * @param {string} baseURL
     * @param {import('@playwright/test').Expect} expect
     * @param {import('@playwright/test').Request} request
     */
    constructor(page, baseURL, expect, request) {
        super(page, baseURL, expect);
        this.request = request;
        this.webhooks = this.initWebhooks();
    }

    /**
     * Init the webhooks available
     * 
     * @returns {Object} The webhooks available
     */
    initWebhooks() {
        return {};
    }

    /**
     * Prepare the URL to use
     * 
     * @param {WebhookOption} options Additional options
     * @returns {string} The URL to use
     */
    getWebhookUrl(options = { webhook, args: [] }) {
        const { webhook, args } = options;
        return `${this.baseURL}/?sq-webhook=${webhook}${this.getWebhookUrlArgs(args)}`;
    }

    /**
     * Encode the arguments to use in the URL
     * @param {Array<Object>} args
     * @returns {string} The encoded arguments for the URL including the leading `?`
     */
    getWebhookUrlArgs(args = []) {
        const $args = args.map(({ name, value }) => `${name}=${encodeURIComponent(value)}`);
        return $args.length ? `&${$args.join('&')}` : '';
    }

    /**
    * Do a webhook request
    * 
    * @param {WebhookOption} options The webhook options
    * @returns {Promise<void|Object>}
    */
    async executeWebhook(options = { webhook, args: [], returnResponse: false }) {
        const { webhook, args = [], returnResponse = false } = options;
        if (!this.webhooks[webhook]) {
            throw new Error(`Webhook "${webhook}" not found`);
        }
        const url = this.getWebhookUrl(options);
        try {
            const response = await this.request.post(url);
            this.expect(response.status(), `Webhook "${url}" response has HTTP 200 code`).toBe(200);
            if (returnResponse) {
                // Return the response payload
                const responseBody = await response.json();
                return responseBody;
            }
        } catch (e) {
            console.log(webhook, args, e);
            throw e;
        }
    }

    /**
     * Execute multiple webhooks sequentially
     *
     * @param {Array<WebhookOption>} webhooks The webhooks to execute.
     * @returns {Promise<void>}
     */
    async executeWebhooksSequentially(webhooks = []) {
        for (const webhookOptions of webhooks) {
            // eslint-disable-next-line no-await-in-loop
            await this.executeWebhook(webhookOptions);
        }
    }
}