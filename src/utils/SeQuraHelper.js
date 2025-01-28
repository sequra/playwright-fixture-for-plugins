import Fixture from '../base/Fixture';

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
     * @param {Object} options Additional options
     * @param {string} options.webhook The webhook
     * @param {Array<Object>} options.args The arguments to pass to the webhook. Each argument is an object with `name` and `value` properties
     * @returns {string} The URL to use
     */
    getWebhookUrl(options = { webhook, args: [] }) {
        return `${this.baseURL}/?sq-webhook=${webhook}${this.getWebhookUrlArgs(args)}`;
    }

    /**
     * Encode the arguments to use in the URL
     * @param {Array<Object>} args
     * @returns {string} The encoded arguments for the URL including the leading `?`
     */
    getWebhookUrlArgs(args = []) {
        const $args = args.map(({ name, value }) => `${name}=${encodeURIComponent(value)}`);
        return $args.length ? `?${$args.join('&')}` : '';
    }

    /**
    * Do a webhook request
    * 
    * @param {Object} options
    * @param {string} options.webhook The webhook to execute
    * @param {Array<Object>} options.args The arguments to pass to the webhook. Each argument is an object with `name` and `value` properties
    * @returns {Promise<void>}
    */
    async executeWebhook(options = { webhook, args: [] }) {
        if (!this.webhooks[webhook]) {
            throw new Error(`Webhook "${webhook}" not found`);
        }
        const url = this.getWebhookUrl(options);
        try {
            const response = await this.request.post(url);
            this.expect(response.status(), `Webhook "${url}" response has HTTP 200 code`).toBe(200);
        } catch (e) {
            console.log(webhook, args, e);
            throw e;
        }
    }
}